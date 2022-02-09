const Discord = require("discord.js");
/**
 *
 * @param {Discord.Client} client
 */ module.exports = (client) => {
  // Load modules
  const backup = require("discord-backup"),
    settings = {
      prefix: client.prefix,
    };

  backup.setStorageFolder(__dirname + "/backups/");

  client.on("messageCreate", async (message) => {
    // This reads the first part of your message behind your prefix to see which command you want to use.
    let command = message.content
      .toLowerCase()
      .slice(settings.prefix.length)
      .split(" ")[0];

    // These are the arguments behind the commands.
    let args = message.content.split(" ").slice(1);

    // If the message does not start with your prefix return.
    // If the user that types a message is a bot account return.
    // If the command comes from DM return.
    if (
      !message.content.startsWith(settings.prefix) ||
      message.author.bot ||
      !message.guild
    )
      return;

    if (command === "create") {
      // Check member permissions
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: | يجب أن تمتلك صلاحيات عليا لإستخدام هذا الأمر!"
        );
      }
      message.channel.send("جار التحميل...").then((msg) => {
        // Create the backup
        backup
          .create(message.guild, {
            jsonBeautify: true,
          })
          .then((backupData) => {
            // And send informations to the backup owner
            message.author.send(
              "تم حفظ الخادم! لإستدعائة, أستخدم هذا الأمر في أي خادم تريده: `" +
                settings.prefix +
                "load " +
                backupData.id +
                "`!"
            );
            msg.edit(
              ":white_check_mark: تم حفظ الخادم. تم إرسال معرف الحافظة في الخاص!"
            );
          });
      });
    }

    if (command === "load") {
      // Check member permissions
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: | يجب أن تمتلك صلاحيات عليا لإستخدام هذا الأمر!"
        );
      }
      let backupID = args[0];
      if (!backupID) {
        return message.channel.send(":x: | لا يوجد معرف بهذا الإسم!");
      }
      // Fetching the backup to know if it exists
      backup
        .fetch(backupID)
        .then(async () => {
          // If the backup exists, request for confirmation
          message.channel.send(
            ":warning: | أثناء الإستدعاء, كل الغرف, الرتب, إلخ. ستستبدل! أكتب `-confirm` للختم!"
          );
          const filter = (m) =>
            m.author.id === message.author.id && m.content === "-confirm";
          message.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 20000,
              errors: ["time"],
            })
            .then((msg) => {
              msg.delete();
              // When the author of the command has confirmed that he wants to load the backup on his server
              message.author.send(":white_check_mark: | تم بدأ الإستدعاء!");
              // Load the backup
              backup
                .load(backupID, message.guild)
                .then(() => {
                  // When the backup is loaded, delete them from the server
                  backup.remove(backupID);
                })
                .catch((err) => {
                  console.log(err);
                  // If an error occurred
                  return message.author.send(
                    ":x: | عفوا, حدث خطأ... تأكد من منحي صلاحيات عليا في الخادم!"
                  );
                });
            })
            .catch((err) => {
              console.log(err);
              // if the author of the commands does not confirm the backup loading
              return message.channel.send(
                ":x: | انتهى الوقت! تم إلغاء الإستدعاء!"
              );
            });
        })
        .catch((err) => {
          console.log(err);
          // if the backup wasn't found
          return message.channel.send(
            ":x: | لا يوجد معرف بهذا الإسم: `" + backupID + "`!"
          );
        });
    }

    if (command === "infos") {
      let backupID = args[0];
      if (!backupID) {
        return message.channel.send(":x: | لا يوجد معرف بهذا الإسم!");
      }
      // Fetch the backup
      backup
        .fetch(backupID)
        .then((backupInfos) => {
          const date = new Date(backupInfos.data.createdTimestamp);
          const yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDate().toString();
          const formatedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
            dd[1] ? dd : "0" + dd[0]
          }`;
          let embed = new Discord.MessageEmbed()
            .setAuthor({ name: "معلومات الحافظة" })
            // Display the backup ID
            .addField("معرف الحافظة", backupInfos.id, false)
            // Displays the server from which this backup comes
            .addField("معرف الخادم", backupInfos.data.guildID, false)
            // Display the size (in mb) of the backup
            .addField("الحجم الكلي", `${backupInfos.size} kb`, false)
            // Display when the backup was created
            .addField("تاريخ الإنشاء", formatedDate, false)
            .setColor("#FF0000");
          message.channel.send({ embeds: [embed] });
        })
        .catch((err) => {
          console.log(err);
          // if the backup wasn't found
          return message.channel.send(
            ":x: | لا يوجد معرف بهذا الإسم: `" + backupID + "`!"
          );
        });
    }
  });
};
