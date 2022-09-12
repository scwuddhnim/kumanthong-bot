import lodash from 'lodash';

let listRegisteredUsers = [];

async function handleListCommand(req, res) {
  let content = 'danh sách trống!';
  if (lodash.size(listRegisteredUsers) > 0) {
    content = listRegisteredUsers.map(userId => {
      return `<@${userId}>`;
    }).join(', ');
    content = `danh sách đã đăng ký: ${content}`
  }
  return res.send({
    type: 4,
    data: {
      content: content
    }
  });
}

async function handleCountCommand(req, res) {
  const count = listRegisteredUsers.length;
  const content = `đã có ${count} người đăng ký cơm nhớ!`;
  return res.send({
    type: 4,
    data: {
      content: content
    }
  });
}

async function handleRegisterCommand(req, res) {
  const userId = lodash.get(req, 'body.member.user.id');
  if (!lodash.includes(listRegisteredUsers, userId)) {
    listRegisteredUsers.push(userId);
  }

  return res.send({
    type: 4,
    data: {
      content: `<@${userId}> đã đăng ký!`
    }
  });
}

async function handleRemoveCommand(req, res) {
  const removeUserId = lodash.get(req, 'body.member.user.id');
  listRegisteredUsers = listRegisteredUsers.filter(userId => {
    return userId !== removeUserId
  });

  return res.send({
    type: 4,
    data: {
      content: `đã xóa <@${removeUserId}> khỏi danh sách!`
    }
  });
}

async function handleClearCommand(req, res) {
  const userId = lodash.get(req, 'body.member.user.id');
  if (userId === '827026836860567612') {
    listRegisteredUsers = [];
    return res.send({
      type: 4,
      data: {
        content: `đã xóa danh sách!`
      }
    });
  } else {
    return res.send({
      type: 4,
      data: {
        content: `bạn không có quyền xóa danh sách!`
      }
    });
  }
}

async function handleRandomCommand(req, res) {
  const numOption = lodash.find(
    lodash.get(req, 'body.data.options', []),
    option => {
      return option.name === 'num'
    }
  );

  let numRandomMembers = 1;
  if (!lodash.isNil(numOption)) {
    numRandomMembers = lodash.get(numOption, 'value');
  }

  let listRandomMembers = lodash.sampleSize(
    listRegisteredUsers, numRandomMembers
  );
  listRandomMembers = listRandomMembers.map(memberId => {
    return `<@${memberId}>`;
  });

  let content = '';
  if (lodash.size(listRandomMembers) > 0) {
    if (lodash.size(listRandomMembers) > 1) {
      const lastMember = listRandomMembers.pop();
      content = listRandomMembers.join(', ');
      content += ` và ${lastMember}`;
    } else {
      content = listRandomMembers[0];
    }
  }

  if (lodash.isEmpty(content)) {
    return res.send({
      type: 4,
      data: {
        content: `chưa có ai đăng ký cơm cả`
      }
    });
  } else {
    return res.send({
      type: 4,
      data: {
        content: `hôm nay ${content} đi lấy cơm`
      }
    });
  }
}

export default async function handleCommands(req, res) {
  const commandName = lodash.get(req, 'body.data.name');
  return {
    'list': handleListCommand,
    'register': handleRegisterCommand,
    'clear': handleClearCommand,
    'remove': handleRemoveCommand,
    'random': handleRandomCommand,
    'count': handleCountCommand,
  }[commandName](req, res);
};
