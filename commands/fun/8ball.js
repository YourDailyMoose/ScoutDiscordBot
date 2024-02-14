const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const botColours = require('../../index');


module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question!')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question you want to ask')
        .setRequired(true)),
  async execute(interaction) {
    // List of possible responses
    const responses = [
      'Yes.',
      'No.',
      'Maybe.',
      'Definitely!',
      'Absolutely not.',
      'Probably.',
      'Probably not.',
      'I don\'t think so.',
      'Meh',
      'Sure, why not?',
      'Ask again later.',
      'I dont care',
      'Go away',
      'No u',
      'LOL NO',
      'When pigs can fly',
      'What a dumb question, don\'t waste my time.',
      'It\'s possible.',
      'It\'s unlikely.',
      'Don\'t count on it.',
      'I would say yes.',
      'I would say no.',
      'There\'s a good chance.',
      'There\'s a slim chance.',
      'LOL NAH KEEP DREAMIN\' BUCKO',
      'yeah no',
      "I'm not sure",
    ];

    // Generate a random index to pick a response
    const randomIndex = Math.floor(Math.random() * responses.length);

    // Reply with the random response
    const embed = new EmbedBuilder()
      .setTitle('🎱 8-Ball')
      .setDescription(`Question: ${interaction.options.getString('question')}\nAnswer: ${responses[randomIndex]}`)
      .setColor(botColours.purple)
    
    interaction.reply({ embeds: [embed] });





  },
};
