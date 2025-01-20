# Zoom Chat API

## Sơ đồ hoạt động
Hệ thống bao gồm các thành phần:
1. Incomming Webhook Zoom App
2. Github webhook
3. Server trung gian
4. Hệ thống khác (Laravel Server)

## Incomming Webhook Zoom App
Ứng dụng Incomming Webhook cho phép bạn gửi trực tiếp tin nhắn từ các dịch vụ bên ngoài đến bất kỳ kênh trò chuyện nào của Zoom. Sử dụng ứng dụng trò chuyện trong bất kỳ kênh nào để tạo endpoint và verification token. Với những thông tin xác thực này, bạn có thể gửi tin nhắn đến kênh trò chuyện Zoom của mình thông qua HTTP POST.
1. Cài đặt
- Cài đặt Incomming Webhook Zoom App thông qua [Zoom Marketplace App](https://marketplace.zoom.us/apps/eH_dLuquRd-VYcOsNGy-hQ)
- Tham khảo [tài liệu](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0067640) của Incomming Webhook
2. Tạo endpoint
- Tạo Channel trên Zoom, sau đó nhấn lệnh dưới để tạo endpoint
```
/inc connect <connection-name>
```
- Incomming Webhook App sẽ hiển thị thông tin endpoint và verification token để gửi tin nhắn
3. Gửi tin nhắn
- Sử dụng **endpoint** và **verification token** ở bước trên, thực hiện kiểm tra chức năng gửi tin nhắn bằng cURL 
```javascript
curl --location <your-endpoint-url> \
--header 'Content-Type: application/json' \
--header 'Authorization: <your-verification-token> \
--header 'Content-Type: application/json' \
--data 'Hello World'
```

## Github Webhook

### Webhook

Webhook cho phép bạn đăng ký (subcribe) nhận thông tin về các sự kiện (event) xảy ra trong một hệ thống phần mềm và tự động nhận dữ liệu gửi đến máy chủ của bạn mỗi khi các sự kiện đó xảy ra.

Webhook được sử dụng để nhận dữ liệu ngay khi event xảy ra, thay vì phải quét API (polling API - gọi đến API một cách không liên tục) để xem dữ liệu có sẵn hay không. Với webhook, bạn chỉ cần subcribe đến sự kiện khi bạn tạo webhook.

### Github Webhook

Khi bạn tạo một webhook, bạn chỉ định một URL và đăng ký nhận thông tin về các sự kiện xảy ra trên GitHub. Khi một sự kiện mà webhook của bạn đã đăng ký xảy ra, GitHub sẽ gửi một yêu cầu HTTP với dữ liệu về sự kiện đó đến URL mà bạn đã chỉ định. Nếu máy chủ của bạn được thiết lập để lắng nghe các thông báo webhook tại URL đó, nó có thể thực hiện hành động khi nhận được thông báo.

※ Tham khảo tài liệu của Github Webhook [tại đây](https://docs.github.com/en/webhooks).

### Cài đặt Github Webhook


> Bạn cần quyền quản trị viên đối với repository để thực hiện thao tác này


1. Vào repository trên github, click vào mục Setting
2. Ở menu bên trái, click vào Webhooks
3. Click vào Add webhook
4. Ở input "Payload URL", nhập url được public ở Server trung gian. URL này sẽ được trigger bởi Github khi xảy ra sự kiện. 
5. Phần "Content type", chọn "application/json".
6. Nhập một random string vào phần "Secret". Mục đích của secret này là để thực hiện việc Authentication ở Server trung gian.\
※ Chú ý: Lưu trữ "Secret" để cài đặt Authentication trên Server trung gian.
7. Phần  "Which events would you like to trigger this webhook?", chọn webhook event mà bạn muốn nhận. Chỉ nên chọn event nào bạn muốn nhận để tránh tình trạng spam tin nhắn. \
Ví dụ: Nếu chỉ muốn nhận thông tin liên quan tới Pull Request, tick vào "Let me select individual events.", rồi chọn mục "Pull requests".
8. Click "Add webhook" để hoàn thành quá trình tạo Github webhook.

## Server trung gian

Server trung gian, được viết bằng nodeJS, sẽ nhận request từ các hệ thống muốn gửi tin nhắn (Github, server dự án, ...), thực hiện authentication các request, chuyển đổi sang định dạng tin nhắn Zoom và gọi endpoint của Incomming Webhook Zoom App để gửi tin nhắn. 

### Cài đặt với Incomming Webhook

Để server trung gian có thể gửi được tin nhắn, thì cần thông tin *endpoint* và *verification token* của Incomming Webhook. Thông tin sẽ được lưu ở file `.env`

```
ZOOM_00_URL=<your-endpoint>
ZOOM_00_TOKEN=<your-verification-token>
```

### Cài đặt với Github Webhook

Server trung gian sẽ cung cấp URL với method là POST (tham khảo file `src\routes\v1\zoom.route.js`), cho phép Github Webhook gọi khi xảy ra sự kiện. URL này sẽ được nhập vào input "Payload URL" khi tạo Github Webhook.

#### Authentication Github Request
Server trung gian sẽ thực hiện việc Authentication request từ Github bằng việc kiểm tra giá trị của `X-Hub-Signature-256` trong request header.

Để thực hiện được việc Authentication, Server trung gian cần thông tin Secret (được điền khi tạo Github Webhook) và lưu vào file `.env`

```
GITHUB_00_SECRET=<your-github-secret>
```

Về cách thức Authentication:
- Tham khảo file `src/middlewares/verifySignatureWebhook.js`
- Đọc thêm về validating Github webhook [tại đây](https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries)
- Mô tả payload của Github webhook [tại đây](https://docs.github.com/en/webhooks/webhook-events-and-payloads#delivery-headers)


### Cài đặt với hệ thống khác (Laravel Server)

Server trung gian sẽ tạo URL tương ứng cho các hệ thống muốn gửi tin nhắn tới Zoom. 

#### Authentication Request
Server trung gian sẽ sử dụng JWT để authentication các request được gửi. Do đó bạn cần điền giá trị jwt secret vào file `.env`

```
JWT_SECRET=<your-jwt-secret>
```

Vào [trang chủ jwt](https://jwt.io/), nhập `JWT_SECRET` vào phần *VERIFY SIGNATURE*, cùng với payload như bên dưới để tạo JWT Token.

```json
{
  "from": "laravel"
}
```

Ghi chú:
-  Phần payload đã bỏ đi thuộc tính `iat` để token được sử dụng vô thời hạn
-  Phần payload ở trên chỉ là ví dụ, có thể thêm bất kì thuộc tính nào mà bạn mong muốn
-  Token sinh ra sẽ được sử dụng ở hệ thống muốn gửi tin nhắn tới Zoom. 

### Deploy với Vercel

Server trung gian cần được deploy lên hệ thống có hỗ trợ SSL, vì thế Vercel được chọn để sử dụng vì các lí do sau:
- Miễn phí
- Dễ cài đặt, dễ deploy, có CLI hỗ trợ
- Cung cấp domain có SSL

> Nếu server mà bạn cài đặt không có SSL, thì bạn có thể chọn **Disable (not recommended)** ở phần **SSL verification** khi cài đặt Github Webhook.

Xem hướng dẫn deploy source NodeJS lên Vercel [tại đây](https://vercel.com/guides/using-express-with-vercel)