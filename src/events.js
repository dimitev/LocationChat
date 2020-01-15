const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
function createRouter(db) {
  const router = express.Router();
  const owner = '';


	router.post('/event', (req, res, next) => {
	  db.query(
		'INSERT INTO events (owner, name, description, date) VALUES (?,?,?,?)',
		[owner, req.body.name, req.body.description, new Date(req.body.date)],
		(error) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json({status: 'ok'});
		  }
		}
	  );
	});
	router.post('/createUser', (req, res, next) => {
	  db.query(
	  		'SELECT * from users where username=?',
		[req.body.username.trim()],
		(error,results) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
			return;
		  }
		  else {
			if(results.length > 0){
				res.status(500).json({status: 'User already exists'});
				return;
			}
			else{
				db.query('INSERT INTO users (username, password) VALUES (?,?)',
				[req.body.username.trim(), req.body.password.trim()],
				(error) => {
				  if (error) {
					console.error(error);
					res.status(500).json({status: 'error'});
				  } else {
					res.status(200).json({status: 'ok'});
				  }
				}
				);
			}
		  }
		}
	  )
		
	});
	router.post('/checkCredentials', (req, res, next) => {
		console.log("req: "+JSON.stringify(req.body));
	  db.query(
		'SELECT * from users where password=? and username=?',
		[req.body.password.trim(), req.body.username.trim()],
		(error,results) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  } else {
			  console.log(results);
			if(results.length > 0){
				res.status(200).json({status: 'ok',userId: results[0].id, isAdmin: results[0].isAdmin ? 1 : 0});
			}
			else{
				res.status(500).json({status: 'Wrong credentials'});
			}
		  }
		}
	  );
		 
	});
	router.post('/createPost', (req, res, next) => {
		currentTime = new Date();
	  db.query(
		'INSERT INTO chatGroups (mainUser, description, content ,date, lat, lon, type) VALUES (?,?,?,?,?,?,?)',
		[req.body.mainUser, req.body.description, req.body.content, currentTime,req.body.lat,req.body.lon,req.body.type],
		(error) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  } else {
			  db.query(
				'SELECT id from chatGroups where mainUser=? and description=? and content=? and date=? and lat=? and lon=? and type=?',
				[req.body.mainUser, req.body.description, req.body.content, currentTime,req.body.lat,req.body.lon,req.body.type],
				(error,results) => {
					if (error) {
						console.error(error);
						res.status(500).json({status: 'error'});
					} else {
						console.error(results);
						var id = results[0] == null ? null:results[0].id;
						res.status(200).json({chatId: id});
					}
				}
			);
		  }
		}
	  );
	});
	router.post('/commentOnPost', (req, res, next) => {
		currentTime = new Date();
	  db.query(
		'INSERT INTO message (userId, chatGroupId, content ,date) VALUES (?,?,?,?)',
	[req.body.userId, req.body.postId, req.body.comment, currentTime],
		(error) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  }
		  else {
				res.status(200).json({status: "ok"});
		  }
		}
	  );
    });

	router.get('/getChats', (req, res, next) => {
	  db.query(
		'SELECT * from chatGroups where lat<? and lat > ? and lon < ? and lon> ? ',
		[req.query.north,req.query.south,req.query.east,req.query.west ],
		(error,results) => {
		  if (error) {
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json({status: 'ok',chats: results});
		  }
		}
	  );
	});
	router.get('/getChatRoom', (req, res, next) => {
		let chatRoom={};
	  db.query(
		'SELECT * from chatGroups JOIN users on users.id = chatGroups.mainUser where chatGroups.id = ?',
		[req.query.chatId],
		(error,results) => {
		  if (error) {
			res.status(500).json({status: 'error'});
			console.error(error);
		  } else {
			  chatRoom.mainChat=results[0];
			  db.query(
				'SELECT message.id,message.date,userId, users.username, content from message JOIN users ON users.id= message.userId where chatGroupId = ? ORDER BY date',
					[req.query.chatId],
					(error,results) => {
					  if (error) {
						res.status(500).json({status: 'error'});
						console.error(error);
						return;
					  } else {
						chatRoom.chats=results;
						res.status(200).json(chatRoom);
					  }
				}
			  );
		  }
		}
	  );
	  
	});
	router.get('/getChatRoomChange', (req, res, next) => {
	let chatRoom={};
	  db.query(
		'SELECT COUNT(id) as count from message where message.chatGroupId=?',
		[req.query.chatId],
		(error,results) => {
		  if (error) {
			res.status(500).json({status: 'error'});
			console.error(error);
		  } else {
			  res.status(200).json(results);
		  }
		}
	  );
	  
	});
	router.get('/event', function (req, res, next) {
	  db.query(
		'SELECT id, name, description, date FROM events WHERE owner=? ORDER BY date LIMIT 10 OFFSET ?',
		[owner, 10*(req.params.page || 0)],
		(error, results) => {
		  if (error) {
			console.log(error);
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json(results);
		  }
		}
	  );
	});
	router.put('/event/:id', function (req, res, next) {
	  db.query(
		'UPDATE events SET name=?, description=?, date=? WHERE id=? AND owner=?',
		[req.body.name, req.body.description, new Date(req.body.date), req.params.id, owner],
		(error) => {
		  if (error) {
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json({status: 'ok'});
		  }
		}
	  );
	});
	router.delete('/deletePost/:id', function (req, res, next) {
	  db.query(
		'DELETE FROM message WHERE chatGroupId=?',
		[req.params.id],
		(error) => {
		  if (error) {
			  console.log(error);
			res.status(500).json({status: 'error'});
		  } else {
			  db.query(
				'DELETE FROM chatGroups WHERE id=?',
				[req.params.id],
				(error) => {
				  if (error) {
					res.status(500).json({status: 'error'});
				  } else {
					res.status(200).json({status: 'ok'});
				  }
				}
			  );
		  }
		}
	  );
	});
	router.delete('/deleteMessage/:id', function (req, res, next) {
	  db.query(
		'DELETE FROM message WHERE id=?',
		[req.params.id],
		(error) => {
		  if (error) {
			res.status(500).json({status: 'error'});
		  } else {
			res.status(200).json({status: 'ok'});
		  }
		}
	  );
	});
	router.delete('/deleteUser/:username', function (req, res, next) {
		console.log("params: " + JSON.stringify(req.params));
		db.query(
		'SELECT * from users where username=?',
		[req.params.username],
		(error,results) => {
		  if (error) {
			console.error(error);
			res.status(500).json({status: 'error'});
		  } else {
			  console.log(results);
			if(results.length > 0){
				
				let id = results[0].id;
				db.query(
					'DELETE FROM message WHERE userId=?',
					[id],
					(error) => {
					  if (error) {
						  console.log(error);
						res.status(500).json({status: 'error'});
					  } else {
						  db.query(
							'DELETE FROM chatGroups WHERE mainUser=?',
							[id],
							(error) => {
							  if (error) {
								res.status(500).json({status: 'error'});
							  } else {
								db.query(
									'DELETE FROM users WHERE id=?',
									[id],
									(error) => {
									  if (error) {
										res.status(500).json({status: 'error'});
									  } else {
										res.status(200).json({status: 'ok'});
									  }
									}
								  );
							  }
							}
						  );
					  }
					}
				  );
			}
			else{
				res.status(500).json({status: 'Wrong credentials'});
			}
		  }
		}
	  );
	  
	});

  return router;
}

module.exports = createRouter;