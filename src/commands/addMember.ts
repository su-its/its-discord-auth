import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandWithArgs from "../types/commandWithArgs";
import Member from "../entities/member";
import { administratorRoleProperty } from "../roles/administrator";
import { addMember } from "../controllers/MemberController";
import Department from "../entities/department";

const addMemberCommand: CommandWithArgs = {
    data: new SlashCommandBuilder()
        .setName("add_member")
        .setDescription("認証コマンド")
        .addStringOption(option =>
            option.setName("mail")
                .setDescription("メールアドレス")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("name")
                .setDescription("名前")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("department")
                .setDescription("学部")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("student_number")
                .setDescription("学籍番号")
                .setRequired(true)),
    execute: addMemberCommandHandler,
};

async function addMemberCommandHandler(interaction: CommandInteraction) {
    //DMでは使用不可
    if (!interaction.guild) return await interaction.reply('このコマンドはサーバー内でのみ使用可能です。');

    //adminロールを持っているか確認
    const isAdmin: boolean = await checkIsAdmin(interaction);
    if (!isAdmin) return await interaction.reply('このコマンドは管理者のみ使用可能です。');

    //引数が正しいか確認
    const isArgsValid: boolean = validateArgs(interaction.options.get("mail")?.value as string, interaction.options.get("department")?.value as string, interaction.options.get("student_number")?.value as string);
    if (!isArgsValid) return await interaction.reply('引数が不正です。');

    await addMember({ mail: interaction.options.get("mail")?.value as string, name: interaction.options.get("name")?.value as string, department: interaction.options.get("department")?.value as string, student_number: interaction.options.get("student_number")?.value as string } as Member);

    await interaction.reply(`name: ${interaction.options.get("name")?.value}`);
}

async function checkIsAdmin(interaction: CommandInteraction): Promise<boolean> {
    const member = await interaction.guild!.members.fetch(interaction.user.id);
    const isAdmin: boolean = member.roles.cache.some(role => role.name === administratorRoleProperty.roleName);
    return isAdmin;
}

function validateArgs(mail: string, department: string, studentNumber: string): boolean {
    return validateEmail(mail) && validateStudentNumber(studentNumber) && validateDepartment(department);
}

function validateEmail(email: string): boolean {
    // mailが@shizuoka.ac.jpで終わっているか検証
    return email.endsWith("@shizuoka.ac.jp");
}

function validateStudentNumber(studentNumber: string): boolean {
    return studentNumber.startsWith("7") || studentNumber.length === 8;
}

function validateDepartment(department: string): boolean {
    return Object.values(Department).includes(department as Department);
}

export default addMemberCommand;