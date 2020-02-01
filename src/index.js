const app = require('./app');

app.listen(app.get('port'), () => console.log('Launch up is on ' + app.get('port')));