const { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed } = require('discord.js');

let setupState = {};

client.commands.set('setup', {
  data: {
    name: 'setup',
    description: 'Starts the setup process',
  },
  execute: async (interaction) => {
    const guildId = interaction.guild.id;
    const hasExistingData = await existingData(guildId); // replace with your actual function

    if (hasExistingData) {
      const embed = new MessageEmbed()
        .setColor('AMBER')
        .setTitle('Existing Settings Found')
        .setDescription('Existing settings were found for this guild, would you like to use them or wipe the existing settings? \n \n **Note:** If you choose to wipe the existing settings, you will have to run the `/setup` command again.')
        .setTimestamp();

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('use_existing_data')
            .setLabel('Use Existing Settings')
            .setStyle('PRIMARY'),
          new MessageButton()
            .setCustomId('wipe_existing_data')
            .setLabel('Wipe Existing Settings')
            .setStyle('DANGER'),
        );

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else {
      startModuleSetup(interaction);
    }

    setupState[guildId] = {
      step: 'existing_data',
      selectedModules: [],
      welcomeMessage: {},
    };
  },
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const guildId = interaction.guild.id;
  const state = setupState[guildId];
  if (!state) return;

  if (state.step === 'existing_data') {
    if (interaction.customId === 'use_existing_data') {
      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Existing Settings Kept')
        .setDescription('Existing settings were kept for this guild. \n\nTo change the settings, please run the `/settings` command.')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      delete setupState[guildId];
    } else if (interaction.customId === 'wipe_existing_data') {
      // Add your data wiping logic here
      startModuleSetup(interaction);
    }
  } else if (state.step === 'module_setup') {
    // Handle module setup interactions here
  }
});

function startModuleSetup(interaction) {
  const guildId = interaction.guild.id;
  const state = setupState[guildId];
  if (!state) return;

  state.step = 'module_setup';

  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setTitle('Module Setup')
    .setDescription('Please select the modules you want to enable.')
    .setTimestamp();

  const row = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('module_select')
        .setPlaceholder('Select modules')
        .addOptions([
          {
            label: 'Moderation',
            description: 'Enable moderation for your server.',
            value: 'moderation',
          },
          // Add more options as needed...
        ]),
    );

  interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
}