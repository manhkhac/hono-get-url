import { Hono } from 'hono'
import { handle } from 'hono/vercel'
export const dynamic = 'force-dynamic'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Vercel!'
  })
})

app.get('/url', async (c) => {  // Đảm bảo route này là async
  const url = new URL(c.req.url);  // Sửa c.url thành c.req.url
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) {
    return c.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    // Gửi yêu cầu fetch đến URL đã nhận
    const response = await fetch(targetUrl);
    
    // Kiểm tra nếu response là thành công
    if (!response.ok) {
      throw new Error('Failed to fetch the URL');
    }

    // Lấy dữ liệu từ URL dưới dạng string
    const data = await response.text();  // Đảm bảo trả về dữ liệu dạng chuỗi

    // Trả về dữ liệu dưới dạng string trong JSON
    return c.json({ data: data });
  } catch (error) {
    return c.json({ error: "Failed to fetch data" }, { status: 500 });
  }
})

export const GET = handle(app)
