<script>
/*
 *  Project Functions Module.
 *  @projects.vue
 */
import axios from "axios";

export default {
  name: "functions",
  data() {
    return {
      /* Input Regeln für Error-Messages */
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben."
      },
      /* Variablen zum Aufrufen der Dialoge*/
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      snackbar: false,
      errorMsg: null,
      /* Variablen zur Zwischenspeicherung von Inputs/ID's */
      check_project: null,
      status: null,
      button_active_state: false,
      selectedProject: null,
      selectedProject1: null,
      getSelectedProject: null,
      /* Einblendung der Benachrichtigung mit Timeout */
      infoText: null,
      timeout: 4000,
      /* Array um Daten für ein Projekt zu speichern/auszulesen */
      project: [],
      projectServices: [],
      newproject: [
        {
          customer_id: null,
          project_title: null,
          status: 0,
          description: null
        }
      ]
    };
  },
  /**
   * Projektdaten beim Laden der Seite direkt auslesen und in der Tabelle einfügen,
   * & Kontrolle ob der JasonWebToken erstellt worden ist. Wenn nicht Redirect zur Loginseite.
   */
  mounted() {
    this.updateprojectTable();
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  /**
   * Create- / Update-Funktion für die Projektverwaltung.
   * Vor der Update- und Delete-Funktion wird duch findProjectByID geprüft ob die ausgewählte ID existiert.
   */
  methods: {
    /**
     * Bei der Erstellung eines Projekts wird ein Array mit Projektinformationen an die createProject - Route übergeben.
     */
    createproject() {
      let addNewproject = {
        customer_id: this.newproject.customer_id,
        project_title: this.newproject.project_title,
        project_status_id: 1,
        description: this.newproject.description
      };
      if (this.$refs.form.validate()) {
        axios
          .post("http://localhost:5000/createproject", addNewproject)
          .then(response => {
            this.dialog = false;
            this.snackbar = true;
            this.infoText = "[INFO] Ein Projekt wurde erfolgreich angelegt.";
            this.updateprojectTable();
          })
          .catch(error => {
            console.log(error);
          });
        return;
      }
    },
    /**
     * Ein Array mit den veränderten Daten wird an die UpdateProject - Route übergeben
     */
    updateproject() {
      this.dialog3 = false;
      let changeproject = {
        project_title: this.newproject.project_title,
        description: this.newproject.description
      };
      axios
        .put(
          "http://localhost:5000/updateproject/" + this.check_project,
          changeproject
        )
        .then(response => {
          this.dialog4 = false;
          this.updateprojectTable();
          this.snackbar = true;
          this.infoText = "[INFO] Projektinformation aktualisiert.";
        })

        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Die ID des Projekts wird an die updateProjectStatus - Route übergeben um den Status auf "Beendet" zu setzen
     */
    updateStatus(project) {
      this.selectedProject = project.project_id;
      let updateState = {
        project_status_id: 2
      };
      axios
        .put(
          "http://localhost:5000/updateprojectstatus/" + this.selectedProject,
          updateState
        )
        .then(response => {
          this.dialog6 = false;
          this.snackbar = true;
          this.infoText = "[INFO] Das Projekt wurde erfolgreich beendet.";
          this.updateprojectTable();
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Es wird über überprüft ob der eingegeben Kunde existiert und anschließend der Dialog fortgeführt / erneut eingeblendet.
     */
    findprojectById() {
      if (this.$refs.form.validate()) {
        axios
          .get("http://localhost:5000/existproject/" + this.check_project)
          .then(response => {
            if (response.data == true) {
              this.dialog3 = false;
              this.dialog4 = true;
            } else {
              this.dialog3 = true;
              this.dialog4 = false;
              this.errorMsg = "Das angegebene Projekt existiert nicht."
            }
          })
          .catch(error => {
            console.log(error);
          });
        return;
      }
    },
    /**
     * Die Einsätze die für eine Projekt-ID angelegt wurden, werden hier ausgegeben
     */
    /**
     * Aktualisierung der Projekttabelle durch einlesen der erneuerten Daten.
     */
    updateprojectTable() {
      axios
        .get("http://localhost:5000/getallprojectwithservice")
        .then(response => {
          this.project = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Schließen der  Hinzufügen-/Bearbeiten-/Löschen-Dialoge und Aktualisierung der Projekttabelle.
     */
    closeDialog() {
      this.updateprojectTable();
      this.dialog = false;
      this.dialog2 = false;
      this.dialog3 = false;
      this.dialog4 = false;
    }
  }
};
</script>