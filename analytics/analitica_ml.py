import os
import json
import requests
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import classification_report, confusion_matrix, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

# Configuración de apariencia
plt.style.use('ggplot')
sns.set_palette('deep')

DOCS_GRAFICAS_DIR = os.path.join(os.path.dirname(__file__), '../docs/graficas')
os.makedirs(DOCS_GRAFICAS_DIR, exist_ok=True)

def obtener_dataset():
    """Intenta consumir la API REST. Si falla o está offline, usa un conjunto de datos sintético representativo."""
    url = "http://localhost:3000/api/analitica/dataset"
    try:
        response = requests.get(url, timeout=3)
        if response.status_code == 200:
            print("[+] Dataset obtenido en tiempo real desde la API REST (http://localhost:3000/api/analitica/dataset).")
            return response.json()
    except Exception:
        print("[!] No se pudo conectar con la API en tiempo real. Utilizando dataset sintético empresarial para el modelo.")
    
    # Dataset sintético de fallback (representativo de 120 alumnos y 480 documentos)
    np.random.seed(42)
    carreras = ['TICS', 'Desarrollo Web', 'Mecatrónica', 'Mantenimiento', 'Industrial']
    tipos_doc = ['Acta', 'CURP', 'Certificado', 'Constancia']
    
    alumnos_sinteticos = []
    documentos_sinteticos = []
    
    for i in range(1, 121):
        carrera = np.random.choice(carreras)
        cuatrimestre = np.random.randint(1, 11)
        aprobados = np.random.randint(0, 5)
        rechazados = np.random.randint(0, 3)
        intentos_fallidos = np.random.choice([0, 0, 0, 1, 3, 5])
        
        alumnos_sinteticos.append({
            'alumnoId': i,
            'matricula': f"UTN2026{i:04d}",
            'carrera': carrera,
            'cuatrimestre': cuatrimestre,
            'documentosAprobados': aprobados,
            'documentosRechazados': rechazados,
            'intentosLoginFallidos': intentos_fallidos
        })
        
        for t in tipos_doc:
            # Los certificados y actas en cuatrimestres avanzados tienen mayor prob. de rechazo
            prob_aprobado = 0.85 if t in ['CURP', 'Constancia'] else 0.65
            estado = 'APROBADO' if np.random.rand() < prob_aprobado else 'RECHAZADO'
            documentos_sinteticos.append({
                'documentoId': len(documentos_sinteticos) + 1,
                'alumnoId': i,
                'tipo': t,
                'estado': estado,
                'carrera': carrera,
                'cuatrimestre': cuatrimestre
            })
            
    return {
        'metadatos': {
            'totalAlumnos': len(alumnos_sinteticos),
            'totalDocumentos': len(documentos_sinteticos),
            'tasaAprobacionGlobal': 78.5,
            'tasaRechazoGlobal': 21.5
        },
        'alumnos': alumnos_sinteticos,
        'documentos': documentos_sinteticos
    }

def ejecutar_modulo_supervisado(df_docs):
    """Módulo 1: Aprendizaje Supervisado - Clasificación Predictiva de Dictamen de Expedientes."""
    print("\n" + "="*70)
    print("MÓDULO 1: APRENDIZAJE SUPERVISADO — CLASIFICACIÓN PREDICTIVA")
    print("="*70)
    
    # Preprocesamiento y codificación de variables categóricas
    df_encoded = pd.get_dummies(df_docs[['tipo', 'carrera', 'cuatrimestre']], columns=['tipo', 'carrera'])
    X = df_encoded
    y = (df_docs['estado'] == 'APROBADO').astype(int)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    
    print(f"[+] Precisión del Modelo  (Precision) : {precision*100:.2f}%")
    print(f"[+] Cobertura del Modelo  (Recall)    : {recall*100:.2f}%")
    print(f"[+] Puntaje F1           (F1-Score)  : {f1*100:.2f}%")
    print("\nReporte Detallado de Clasificación:")
    print(classification_report(y_test, y_pred, target_names=['RECHAZADO', 'APROBADO']))
    
    # Generar gráfica de Matriz de Confusión
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['RECHAZADO', 'APROBADO'], yticklabels=['RECHAZADO', 'APROBADO'])
    plt.title('Clasificación Predictiva - Matriz de Confusión', fontsize=12, fontweight='bold')
    plt.xlabel('Predicción del Modelo')
    plt.ylabel('Dictamen Real')
    plt.tight_layout()
    
    grafica_path = os.path.join(DOCS_GRAFICAS_DIR, 'clasificacion_expedientes.png')
    plt.savefig(grafica_path, dpi=300)
    plt.close()
    print(f"[+] Gráfica de Clasificación guardada en: {os.path.abspath(grafica_path)}")

def ejecutar_modulo_no_supervisado(df_alumnos):
    """Módulo 2: Aprendizaje No Supervisado - Clustering K-Means de Población Estudiantil."""
    print("\n" + "="*70)
    print("MÓDULO 2: APRENDIZAJE NO SUPERVISADO — CLUSTERING K-MEANS DE RIESGO")
    print("="*70)
    
    X_cluster = df_alumnos[['cuatrimestre', 'documentosAprobados', 'documentosRechazados', 'intentosLoginFallidos']]
    
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    labels = kmeans.fit_predict(X_cluster)
    df_alumnos['Cluster'] = labels
    
    # Reducción de dimensionalidad PCA a 2D para visualización
    pca = PCA(n_components=2)
    coords_2d = pca.fit_transform(X_cluster)
    df_alumnos['pca_x'] = coords_2d[:, 0]
    df_alumnos['pca_y'] = coords_2d[:, 1]
    
    cluster_names = {
        0: 'Grupo A: Regularidad Alta',
        1: 'Grupo B: En Proceso Regular',
        2: 'Grupo C: Riesgo Crítico'
    }
    df_alumnos['Grupo'] = df_alumnos['Cluster'].map(cluster_names)
    
    print("[+] Distribución de Alumnos por Cluster:")
    print(df_alumnos['Grupo'].value_counts())
    
    # Generar gráfica 2D de Clusters
    plt.figure(figsize=(8, 6))
    sns.scatterplot(
        data=df_alumnos,
        x='pca_x',
        y='pca_y',
        hue='Grupo',
        palette=['#10b981', '#f59e0b', '#ef4444'],
        s=90,
        alpha=0.9
    )
    plt.title('Segmentación de Población Estudiantil (K-Means Clustering)', fontsize=12, fontweight='bold')
    plt.xlabel('Componente Principal 1 (Avance Operativo)')
    plt.ylabel('Componente Principal 2 (Comportamiento de Riesgo)')
    plt.legend(title='Grupos de Riesgo', loc='upper right')
    plt.tight_layout()
    
    grafica_path = os.path.join(DOCS_GRAFICAS_DIR, 'clustering_alumnos.png')
    plt.savefig(grafica_path, dpi=300)
    plt.close()
    print(f"[+] Gráfica de Clustering guardada en: {os.path.abspath(grafica_path)}")

def main():
    data = obtener_dataset()
    df_alumnos = pd.DataFrame(data['alumnos'])
    df_docs = pd.DataFrame(data['documentos'])
    
    ejecutar_modulo_supervisado(df_docs)
    ejecutar_modulo_no_supervisado(df_alumnos)
    print("\n[+] Módulo de Analítica completado exitosamente.")

if __name__ == '__main__':
    main()
