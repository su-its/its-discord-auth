import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type Command from "../../../domain/types/command";
import checkIsAdmin from "../../../utils/checkMemberRole";
import { generateChannelActivityRanking } from "../../usecases/getHotChannels";

const hotChannelsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("hot_channels")
    .setDescription("Show hot channels ranking"),

  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guild) {
      await interaction.reply("このコマンドはサーバーでのみ実行可能です");
      return;
    }

    const isAdmin: boolean = await checkIsAdmin(interaction);
    if (!isAdmin) {
      await interaction.reply("このコマンドは管理者のみ使用可能です");
      return;
    }

    try {
      const ranking = await generateChannelActivityRanking(interaction.guild);
      await interaction.reply({ embeds: [ranking] });
    } catch (error) {
      console.error("Error generating channel activity ranking:", error);
      await interaction.reply("ランキングの生成中にエラーが発生しました。");
    }
  },
};

export default hotChannelsCommand;
