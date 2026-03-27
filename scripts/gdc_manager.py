import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import json
import shutil
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

# Configurações de Caminhos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NOTICIAS_JSON = os.path.join(BASE_DIR, 'src', 'data', 'noticias.json')
DRAFT_JSON = os.path.join(BASE_DIR, 'src', 'data', 'draft_noticias.json')
DRAFT_CARTOLA_JSON = os.path.join(BASE_DIR, 'src', 'data', 'draft_cartola.json')
CARTOLA_JSON = os.path.join(BASE_DIR, 'src', 'data', 'cartola_tips.json')
IMG_DIR = os.path.join(BASE_DIR, 'public', 'noticias')

class GDCManager:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("GDC Arena - Gerenciador de Conteúdo")
        self.root.geometry("800x650")
        self.root.configure(bg="#121212")

        self.drafts: List[Dict[str, Any]] = []
        self.current_news_idx: int = 0
        self.new_articles: List[Dict[str, Any]] = []
        self.cartola_data: Dict[str, Any] = {}
        self.img_var = tk.StringVar(value="")

        # Widgets
        self.title_ent: Optional[tk.Entry] = None
        self.excerpt_txt: Optional[tk.Text] = None
        self.rodada_ent: Optional[tk.Entry] = None
        self.e_title: Optional[tk.Entry] = None
        self.e_desc: Optional[tk.Text] = None

        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure("TFrame", background="#121212")
        self.style.configure("TLabel", background="#121212", foreground="white", font=("Arial", 10))
        self.style.configure("TButton", font=("Arial", 10, "bold"))

        self.main_frame = ttk.Frame(self.root, padding="20")
        self.main_frame.pack(fill=tk.BOTH, expand=True)

        self.show_main_menu()

    def clear_frame(self):
        for widget in self.main_frame.winfo_children():
            widget.destroy()

    def show_main_menu(self):
        self.clear_frame()
        ttk.Label(self.main_frame, text="O que deseja atualizar hoje?", font=("Arial", 16, "bold")).pack(pady=40)
        ttk.Button(self.main_frame, text="ATUALIZAR NOTÍCIAS (NotebookLM)", command=self.start_news_update, width=40).pack(pady=10)
        ttk.Button(self.main_frame, text="ATUALIZAR CARTOLA (NotebookLM)", command=self.start_cartola_update, width=40).pack(pady=10)

    def start_news_update(self):
        if not os.path.exists(DRAFT_JSON):
            messagebox.showerror("Erro", "Arquivo de rascunho de notícias não encontrado!")
            return
        with open(DRAFT_JSON, 'r', encoding='utf-8') as f:
            self.drafts = json.load(f)
        self.current_news_idx = 0
        self.new_articles = []
        self.show_news_validator()

    def show_news_validator(self):
        self.clear_frame()
        if self.current_news_idx >= len(self.drafts):
            self.finalize_news_update()
            return

        item = self.drafts[self.current_news_idx]
        ttk.Label(self.main_frame, text=f"Validando Notícia {self.current_news_idx + 1} de {len(self.drafts)}", font=("Arial", 12, "bold")).pack(pady=10)

        ttk.Label(self.main_frame, text="Título:").pack(anchor=tk.W)
        self.title_ent = tk.Entry(self.main_frame, width=80, bg="#1e1e1e", fg="white", insertbackground="white")
        self.title_ent.insert(0, item.get('title', ''))
        self.title_ent.pack(pady=5)

        ttk.Label(self.main_frame, text="Resumo (Excerpt):").pack(anchor=tk.W)
        self.excerpt_txt = tk.Text(self.main_frame, height=5, width=80, bg="#1e1e1e", fg="white", insertbackground="white")
        self.excerpt_txt.insert(tk.END, item.get('excerpt', ''))
        self.excerpt_txt.pack(pady=5)

        self.img_var.set("")
        img_f = ttk.Frame(self.main_frame)
        img_f.pack(fill=tk.X, pady=10)
        ttk.Button(img_f, text="Selecionar Imagem", command=lambda: self.img_var.set(filedialog.askopenfilename())).pack(side=tk.LEFT)
        ttk.Label(img_f, textvariable=self.img_var).pack(side=tk.LEFT, padx=10)

        nav = ttk.Frame(self.main_frame)
        nav.pack(side=tk.BOTTOM, fill=tk.X, pady=20)
        ttk.Button(nav, text="PULAR", command=self.skip_news).pack(side=tk.LEFT, padx=5)
        ttk.Button(nav, text="CONFIRMAR E PRÓXIMA", command=self.save_current_news).pack(side=tk.RIGHT, padx=5)

    def save_current_news(self):
        if not self.title_ent or not self.excerpt_txt: return
        title = self.title_ent.get()
        excerpt = self.excerpt_txt.get("1.0", tk.END).strip()
        img = self.img_var.get()
        if not img and not messagebox.askyesno("Aviso", "Continuar sem imagem?"): return
        
        filename = ""
        if img:
            ext = os.path.splitext(img)[1]
            filename = f"news_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{self.current_news_idx}{ext}"
            shutil.copy(img, os.path.join(IMG_DIR, filename))

        # Usando chaves legadas para compatibilidade
        self.new_articles.append({
            "id": f"{datetime.now().strftime('%Y%m%d%H%M%S')}{self.current_news_idx}",
            "title": title, 
            "excerpt": excerpt, 
            "full_content": excerpt, # Replica excerpt como conteúdo completo
            "image_url": f"/noticias/{filename}" if filename else "",
            "date": datetime.now().strftime("%Y-%m-%d"), 
            "category": "VASCO",
            "source_url": self.drafts[self.current_news_idx].get('url', '#'),
            "source_name": self.drafts[self.current_news_idx].get('source', 'GDC Arena')
        })
        self.current_news_idx += 1
        self.show_news_validator()

    def skip_news(self):
        self.current_news_idx += 1
        self.show_news_validator()

    def finalize_news_update(self):
        if not self.new_articles: self.show_main_menu(); return
        try:
            existing = []
            if os.path.exists(NOTICIAS_JSON):
                with open(NOTICIAS_JSON, 'r', encoding='utf-8') as f: existing = json.load(f)
            updated = (self.new_articles + existing)[:50]
            with open(NOTICIAS_JSON, 'w', encoding='utf-8') as f: json.dump(updated, f, indent=2, ensure_ascii=False)
            messagebox.showinfo("Sucesso", f"{len(self.new_articles)} notícias publicadas!")
            self.show_main_menu()
        except Exception as e: messagebox.showerror("Erro", str(e))

    def start_cartola_update(self):
        self.clear_frame()
        draft_cartola = {}
        if os.path.exists(DRAFT_CARTOLA_JSON):
            with open(DRAFT_CARTOLA_JSON, 'r', encoding='utf-8') as f: draft_cartola = json.load(f)
        try:
            with open(CARTOLA_JSON, 'r', encoding='utf-8') as f: self.cartola_data = json.load(f)
        except: messagebox.showerror("Erro", "Erro ao abrir cartola_tips.json"); self.show_main_menu(); return

        if draft_cartola:
            self.cartola_data['rodada'] = draft_cartola.get('rodada', self.cartola_data.get('rodada'))
            if 'consolidated' not in self.cartola_data: self.cartola_data['consolidated'] = {}
            cons = draft_cartola.get('consolidated', {})
            self.cartola_data['consolidated']['title'] = cons.get('title', self.cartola_data['consolidated'].get('title'))
            self.cartola_data['consolidated']['description'] = cons.get('description', self.cartola_data['consolidated'].get('description'))

        ttk.Label(self.main_frame, text="Atualizar Dicas do Cartola (NotebookLM)", font=("Arial", 12, "bold")).pack(pady=10)
        ttk.Label(self.main_frame, text="Rodada:").pack(anchor=tk.W)
        self.rodada_ent = tk.Entry(self.main_frame, width=10, bg="#1e1e1e", fg="white", insertbackground="white")
        self.rodada_ent.insert(0, str(self.cartola_data.get('rodada', '')))
        self.rodada_ent.pack(pady=5, anchor=tk.W)

        ttk.Label(self.main_frame, text="Título Elite Command:").pack(anchor=tk.W)
        self.e_title = tk.Entry(self.main_frame, width=80, bg="#1e1e1e", fg="white", insertbackground="white")
        self.e_title.insert(0, self.cartola_data.get('consolidated', {}).get('title', ''))
        self.e_title.pack(pady=5)

        ttk.Label(self.main_frame, text="Descrição Consolidada:").pack(anchor=tk.W)
        self.e_desc = tk.Text(self.main_frame, height=8, width=80, bg="#1e1e1e", fg="white", insertbackground="white")
        self.e_desc.insert(tk.END, self.cartola_data.get('consolidated', {}).get('description', ''))
        self.e_desc.pack(pady=5)

        nav = ttk.Frame(self.main_frame)
        nav.pack(side=tk.BOTTOM, fill=tk.X, pady=20)
        ttk.Button(nav, text="VOLTAR", command=self.show_main_menu).pack(side=tk.LEFT, padx=5)
        ttk.Button(nav, text="SALVAR DICAS", command=self.save_cartola).pack(side=tk.RIGHT, padx=5)

    def save_cartola(self):
        if not self.rodada_ent or not self.e_title or not self.e_desc: return
        try:
            self.cartola_data['rodada'] = int(self.rodada_ent.get())
            self.cartola_data['consolidated']['title'] = self.e_title.get()
            self.cartola_data['consolidated']['description'] = self.e_desc.get("1.0", tk.END).strip()
            with open(CARTOLA_JSON, 'w', encoding='utf-8') as f: json.dump(self.cartola_data, f, indent=2, ensure_ascii=False)
            messagebox.showinfo("Sucesso", "Dicas do Cartola atualizadas!")
            self.show_main_menu()
        except Exception as e: messagebox.showerror("Erro", str(e))

if __name__ == "__main__":
    if not os.path.exists(IMG_DIR): os.makedirs(IMG_DIR)
    r = tk.Tk()
    app = GDCManager(r)
    r.mainloop()
