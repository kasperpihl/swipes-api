import config from 'config';
import mandrill from 'mandrill-api/mandrill';
const mandrillClient = new mandrill.Mandrill(config.get('mandrillKey'));

export default options => {
  return new Promise((resolve, reject) => {
    mandrillClient.messages.sendTemplate(options, resolve, reject);
  });
};
