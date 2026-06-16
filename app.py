import os
import json
from flask import Flask, jsonify, request

app = Flask(__name__, static_folder='static', static_url_path='')

PASSWORD_ADMIN = "mundial2026"
DATA_FILENAME = os.path.join('static', 'data.json')
SCORES_FILENAME = "scores.json"

def load_scores():
    if not os.path.exists(SCORES_FILENAME):
        return {}
    try:
        with open(SCORES_FILENAME, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}

def save_scores(scores):
    try:
        with open(SCORES_FILENAME, 'w', encoding='utf-8') as f:
            json.dump(scores, f, indent=4, ensure_ascii=False)
        return True
    except Exception:
        return False

def load_quiniela_data():
    if not os.path.exists(DATA_FILENAME):
        return {"error": "Archivo data.json no encontrado en el servidor."}
        
    try:
        with open(DATA_FILENAME, 'r', encoding='utf-8') as f:
            static_matches = json.load(f)
    except Exception as e:
        return {"error": f"Error al cargar data.json: {str(e)}"}
        
    scores = load_scores()
    
    # 1. Merge static matches with dynamic scores and calculate outcomes
    matches = []
    for m in static_matches:
        row_str = str(m['row'])
        
        # Read goals from scores.json
        if row_str in scores:
            g_l = scores[row_str].get('goles_local')
            g_v = scores[row_str].get('goles_visitante')
            
            # Outcome determination
            if g_l is not None and g_v is not None:
                if g_l > g_v:
                    outcome = "Local (L)"
                elif g_l < g_v:
                    outcome = "Visitante (V)"
                else:
                    outcome = "Empate (E)"
            else:
                g_l = None
                g_v = None
                outcome = None
        else:
            g_l = None
            g_v = None
            outcome = None
            
        match_info = {
            'row': m['row'],
            'group': m['group'],
            'local': m['local'],
            'goles_local': g_l,
            'goles_visitante': g_v,
            'visitante': m['visitante'],
            'date': m['date'],
            'time': m.get('time', '12:00'),
            'outcome': outcome,
            'predictions': {}
        }
        
        # Process participant predictions
        participants = ['Deivid', 'Cesar', 'Ferney', 'Edisabet', 'Jhair', 'Duvan']
        for p in participants:
            pred = m['predictions'].get(p, "")
            
            is_correct = False
            points = 0
            status = 'pending'
            
            if outcome:
                # If outcome (e.g. 'Local (L)') is in prediction string, they guessed right
                if outcome in pred:
                    is_correct = True
                    points = 1
                    status = 'correct'
                else:
                    is_correct = False
                    points = 0
                    status = 'incorrect'
            else:
                status = 'pending'
                
            # Resolve prediction display
            pred_display = ""
            if "Local (L)" in pred:
                pred_display = match_info['local']
            elif "Visitante (V)" in pred:
                pred_display = match_info['visitante']
            elif "Empate (E)" in pred:
                pred_display = "Empate"
            else:
                pred_display = "Sin predicción"
                
            match_info['predictions'][p] = {
                'prediction_raw': pred,
                'prediction_display': pred_display,
                'is_correct': is_correct,
                'points': points,
                'status': status
            }
            
        matches.append(match_info)
        
    # 2. Calculate participant scoreboard
    participants = ['Deivid', 'Cesar', 'Ferney', 'Edisabet', 'Jhair', 'Duvan']
    player_scores = {p: {'points': 0, 'correct': 0, 'incorrect': 0, 'pending': 0} for p in participants}
    
    for m in matches:
        outcome = m['outcome']
        for p in participants:
            p_pred = m['predictions'][p]
            if outcome:
                if p_pred['is_correct']:
                    player_scores[p]['correct'] += 1
                    player_scores[p]['points'] += 1
                else:
                    player_scores[p]['incorrect'] += 1
            else:
                player_scores[p]['pending'] += 1
                
    max_points = 0
    for p in participants:
        if player_scores[p]['points'] > max_points:
            max_points = player_scores[p]['points']
            
    leaderboard = []
    for p in participants:
        leaderboard.append({
            'name': p,
            'points': player_scores[p]['points'],
            'correct': player_scores[p]['correct'],
            'incorrect': player_scores[p]['incorrect'],
            'pending': player_scores[p]['pending'],
            'is_leader': player_scores[p]['points'] == max_points
        })
        
    # Sort leaderboard: points desc, correct desc, name asc
    leaderboard.sort(key=lambda x: (-x['points'], -x['correct'], x['name']))
    
    # Sort matches: date asc, time asc, row asc
    matches.sort(key=lambda x: (x.get('date', ''), x.get('time', ''), x['row']))
    
    return {
        'matches': matches,
        'leaderboard': leaderboard
    }

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    data = load_quiniela_data()
    if "error" in data:
        return jsonify(data), 500
    return jsonify(data)

@app.route('/api/update_match', methods=['POST'])
def update_match():
    body = request.json or {}
    password = body.get('password')
    row = body.get('row')
    goles_local = body.get('goles_local')
    goles_visitante = body.get('goles_visitante')
    
    # 1. Verify password
    if password != PASSWORD_ADMIN:
        return jsonify({"success": False, "error": "Clave incorrecta"}), 403
        
    if not row:
        return jsonify({"success": False, "error": "Fila no especificada"}), 400
        
    try:
        row = int(row)
        # Parse goals
        if goles_local == "" or goles_local is None:
            goles_l = None
        else:
            goles_l = int(goles_local)
            
        if goles_visitante == "" or goles_visitante is None:
            goles_v = None
        else:
            goles_v = int(goles_visitante)
    except ValueError:
        return jsonify({"success": False, "error": "Los marcadores deben ser números enteros"}), 400
        
    # 2. Update scores.json
    try:
        scores = load_scores()
        row_str = str(row)
        
        if goles_l is not None and goles_v is not None:
            scores[row_str] = {
                'goles_local': goles_l,
                'goles_visitante': goles_v
            }
        else:
            if row_str in scores:
                del scores[row_str]
                
        if save_scores(scores):
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "error": "Error al guardar en el archivo de puntuaciones"}), 500
            
    except Exception as e:
        return jsonify({"success": False, "error": f"Error del servidor: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
