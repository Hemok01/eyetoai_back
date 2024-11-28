from pyngrok import ngrok, conf

# ngrok 인증 토큰 설정
conf.get_default().auth_token = "YOUR_NGROK_AUTH_TOKEN"

# 로컬 서버 포트를 터널링
http_tunnel = ngrok.connect(3000)
print(f"ngrok 공개 URL: {http_tunnel.public_url}")
