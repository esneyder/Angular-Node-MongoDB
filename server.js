var socket = require( 'socket.io' ),
 	express = require( 'express' ),
 	http = require( 'http' ),
 	mongoose = require('mongoose'),
 	Schema = mongoose.Schema;


var app = express(),
 	server = http.createServer( app ),
 	io = socket.listen( server );


mongoose.connect( 'mongodb://127.0.0.1/tareas' );

var TareaSchema = new Schema({
	texto: String,
	hecho: Boolean
});

var Tareas = mongoose.model( 'tareas', TareaSchema ); 

// Configuración
app.configure(function() {
    app.use(express.static(__dirname + '/'));	
    app.use(express.logger('dev'));					
    app.use(express.bodyParser());					
    app.use(express.methodOverride());					
});

app.get('/all', function(req, res) {				
    Tareas.find(function(err, tareas) {
        if(err) {
            res.send(err);
        }
        res.json(tareas);
    });
    
});

app.post('/new', function(req, res) {	
	
   Tareas.create({
        texto: req.body.tarea,
        hecho: req.body.hecho,
    }, function(err, todo){
        if(err) {
            res.send(err);
        }

        Tareas.find(function(err, tareas) {
            if(err){
                res.send(err);
            }
            io.sockets.emit( 'update' );
        });
    });
    

});

app.get('/changeStatus/:id', function (req, res){
    Tareas.findById(req.params.id, function(err, p) {
        if (!p){
            return next(new Error('Could not load Document'));
        }else {
            // do your updates here
            p.hecho = !p.hecho;

            p.save(function(err) {
                if (err){
                    console.log('error')
                }else{
                    console.log('success')
                    io.sockets.emit( 'update' );
                }
            });
        }
    });

});


app.get('/remove/:id', function (req, res){

    Tareas.remove({ _id: req.params.id}, function(err) {
        if (!err) {
            console.log('Removed success')
            io.sockets.emit( 'update' );
        }else {
            console.log('error')
        }
    }); 

});


app.get('*', function(req, res) {						
    res.sendfile('./index.html');				
});


server.listen( 80 );