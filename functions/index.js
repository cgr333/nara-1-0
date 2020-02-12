const {
  dialogflow,
  BasicCard,
  BrowseCarousel,
  BrowseCarouselItem,
  Button,
  Carousel,
  Image,
  LinkOutSuggestion,
  List,
  MediaObject,
  Suggestions,
  SimpleResponse,
  Table,
 } = require('actions-on-google');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

// initialise DB connection
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://nara-bdrerq.firebaseio.com',
});

process.env.DEBUG = 'dialogflow:debug';

const app = dialogflow({debug: true});

/*Functions*/
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  //Funcion para grabar el consentimiento del tratamiento de datos
  function f_consentimiento(agent) {
    const p_consiente = agent.parameters.p_aceptar;

    return admin.database().ref('siniestro').transaction((siniestro) => {
      if(siniestro !== null) {
        siniestro.tratamiento_datos = p_consiente;
      }
      return siniestro;
    }, function(error, isSuccess) {
      console.log('Update consentimiento success: ' + isSuccess);
    });

  }

  //Funcion para grabar la matricula del titular
  function f_matricula(agent) {
    const p_imatricula = agent.parameters.p_matricula;

    return admin.database().ref('siniestro').transaction((siniestro) => {
      if(siniestro !== null) {
        siniestro.matricula_titular = p_imatricula;
      }
      return siniestro;
    }, function(error, isSuccess) {
      console.log('Update matricula titular success: ' + isSuccess);
    });

  }

  //Funcion para grabar la localizacion del siniestro
  function f_localizacion(agent) {
    const p_localizacion = agent.parameters.p_l_siniestro;

    return admin.database().ref('siniestro').transaction((siniestro) => {
      if(siniestro !== null) {
        siniestro.localizacion = p_localizacion;
      }
      return siniestro;
    }, function(error, isSuccess) {
      console.log('Update localizacion siniestro success: ' + isSuccess);
    });

  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Inicio - Si', f_consentimiento);
  intentMap.set('Siniestro - Si matricula', f_matricula);
  intentMap.set('Siniestro - Localizacion si', f_localizacion);
  agent.handleRequest(intentMap);
});

/*
//Functions
app.intent('Precios[Incompleta]', (conv) => {
	conv.ask(new SimpleResponse({
		speech:"¿Sobre qué bicicleta te gustaría saber el precio?",
        text:"¿Sobre qué bicicleta te gustaría saber el precio?",
    }));
	conv.ask(new Suggestions(['Bicicleta de montaña', 'Bicicleta urbana', 'Bicicleta mixta']));
});


//Firestore integación
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function TipoV(agent) {
    const tVehiculo = agent.parameters.tipo_vehiculo;

    agent.add(`Registramos su` + tVehiculo);



    return admin.database().ref('tipo_vehiculo').transaction((tipo_vehiculo) => {
      if(tipo_vehiculo !== null) {
        tipo_vehiculo.tipo = tVehiculo;
      }
      return tipo_vehiculo;
    }, function(error, isSuccess) {
      console.log('Update average age transaction success: ' + isSuccess);
    });

  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Tipo Vehiculo', TipoV);
  agent.handleRequest(intentMap);
});
*/
