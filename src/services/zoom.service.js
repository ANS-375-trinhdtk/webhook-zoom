const createZoomMessage = (githubPayload) => {
  const { number, pull_request } = githubPayload;

  const pullRequestInfo = {};
  let messageTitle = `Người dùng ${
    pull_request.user.login ?? "unknown"
  } vừa tạo PR #${number}`;
  let pullRequestTitle = `Tiêu đề: ${pull_request.title ?? "unknown"}`;
  let pullRequestUrl = `Link: ${pull_request.url ?? "unknown"}`;
  pullRequestInfo.messageTitle = messageTitle;
  pullRequestInfo.pullRequestTitle = pullRequestTitle;
  pullRequestInfo.pullRequestUrl = pullRequestUrl;

  return generateZoomMessage(pullRequestInfo);
};

const generateZoomMessage = (pullRequestInfo) => {
  return {
    body: [
      {
        type: "message",
        text: pullRequestInfo.messageTitle,
        style: {
          color: "#13C4A3",
          bold: true,
          italic: false,
        },
      },
      {
        type: "message",
        text: pullRequestInfo.pullRequestTitle,
        style: {
          bold: false,
          italic: false,
        },
      },
      {
        type: "message",
        text: pullRequestInfo.pullRequestUrl,
        style: {
          bold: false,
          italic: false,
        },
      },
    ],
  };
};

module.exports = {
  createZoomMessage,
};