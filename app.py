# app.py (Lógica para Gerenciamento do Tema)
from flask import Flask, render_template, redirect, request, jsonify, make_response
import urllib.parse

app = Flask(__name__)

# Configuração da sua Con3cta
MEU_WHATSAPP_COM_DDI = "5519999999999"

@app.route('/')
def home():
    """Renderiza a Landing Page, lendo a preferência de tema salva."""
    
    # Busca a preferência de tema nos cookies (padrão é 'dark')
    theme = request.cookies.get('theme', 'dark')
    
    return render_template('index.html', theme=theme)

@app.route('/agendar')
def agendar_whatsapp():
    """Link pro WhatsApp com a mensagem padrão de diagnóstico."""
    mensagem = "Olá Con3cta! Simulei meu lucro no site e gostaria de agendar um diagnóstico gratuito."
    url = f"https://api.whatsapp.com/send?phone={+5519991391820}&text={urllib.parse.quote(mensagem)}"
    return redirect(url)

# NOVA ROTA DE API: Para Salvar a Preferência do Tema
@app.route('/api/toggle_theme', methods=['POST'])
def toggle_theme():
    """Recebe a nova preferência de tema e salva em um cookie."""
    try:
        data = request.json
        new_theme = data.get('theme')
        
        # Cria a resposta JSON
        resp = make_response(jsonify({'status': 'success', 'theme_saved': new_theme}))
        
        # Salva a preferência em um cookie por 30 dias
        resp.set_cookie('theme', new_theme, max_age=60*60*24*30)
        
        return resp

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)