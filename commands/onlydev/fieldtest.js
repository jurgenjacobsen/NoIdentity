exports.run = async (Discord, client, message, args, i18n) => {
    if(message.author.id === client.config.ownerID) {
        try {

            const axios = require('axios') //you can use any http client
            const tf = require('@tensorflow/tfjs-node')
            const nsfw = require('nsfwjs')
            async function fn() {
              const pic = await axios.get(args[0], {
                responseType: 'arraybuffer',
              })
              const model = await nsfw.load()

              const image = await tf.node.decodeImage(pic.data,3)
              const predictions = await model.classify(image)
              image.dispose()
              console.log(predictions)
            }
            fn()

        } catch(err) {
            console.log(err);
        }
    }
};

exports.config = {
    name: 'fieldtest',
    enabled: true,
    guildOnly: false,
    aliases: ['ft'],
    permissions: []
  };
  
  exports.help = {
      name: '',
      category: 'Somente para desenvolvedores',
      description: 'test',
      usage: 'test'
  };