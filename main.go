package main

import (
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"html/template"
	"net/http"
	"os"
)

func main() {
	r := mux.NewRouter()

	fs := http.FileServer(http.Dir("./public"))
	r.PathPrefix("/js/").Handler(fs)
	r.Path("/favicon.ico").Handler(fs)
	r.Path("/apple-touch-icon.png").Handler(fs)

	r.HandleFunc("/", Index).Methods("GET")

	//OpenInBrowser("http://127.0.0.1:" + Config.Port)
	_ = http.ListenAndServe(":80", handlers.LoggingHandler(os.Stdout, r))
}

func Index(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	main := "./templates/index.html"
	base := "./templates/base.html"

	tmpl, err := template.ParseFiles(main, base)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	err = tmpl.ExecuteTemplate(w, "index", nil)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

}