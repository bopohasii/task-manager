import application from './app';

application.listen(application.get('port'), () => console.log('Launch up is on ' + application.get('port')));