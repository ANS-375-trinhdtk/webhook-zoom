const createZoomMessage = (githubPayload) => {
  const { number, pull_request } = githubPayload;

  const pullRequestInfo = {};
  let messageTitle = `Người dùng ${
    pull_request.user.login ?? "unknown"
  } vừa tạo PR #${number}`;
  let pullRequestTitle = `Tiêu đề: ${pull_request.title ?? "unknown"}`;
  let pullRequestUrl = `Link: ${pull_request.html_url ?? "unknown"}`;
  pullRequestInfo.messageTitle = messageTitle;
  pullRequestInfo.pullRequestTitle = pullRequestTitle;
  pullRequestInfo.pullRequestUrl = pullRequestUrl;

  return generateZoomMessage(pullRequestInfo);
};

const createErrorMessage = (errorPayload) => {
  const { message, file, line } = errorPayload;
  const errorInfo = {};
  let errorMessage = `Error: ${message ?? "unknown"}`;
  let errorFile = `File: ${file ?? "unknown"}`;
  let errorLine = `Line: ${line ?? "unknown"}`;
  errorInfo.message = errorMessage;
  errorInfo.file = errorFile;
  errorInfo.line = errorLine;

  return generateErrorMessage(errorInfo);
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

const generateErrorMessage = (errorInfo) => {
  return {
    body: [
      {
        type: "message",
        text: errorInfo.message,
        style: {
          color: "#ff0000",
          bold: true,
          italic: false,
        },
      },
      {
        type: "message",
        text: errorInfo.file,
      },
      {
        type: "message",
        text: errorInfo.line,
      },
    ],
  };
};

module.exports = {
  createZoomMessage,
  createErrorMessage
};
