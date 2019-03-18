// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyDeoBpT_LE_ABbneoeoYSWVcavpZbxse78',
    authDomain: 'emotion-recognition-database.firebaseapp.com',
    databaseURL: 'https://emotion-recognition-database.firebaseio.com',
    projectId: 'emotion-recognition-database',
    storageBucket: 'emotion-recognition-database.appspot.com',
    messagingSenderId: '241127961624'
  }
};
