<script>
/*
 *  Service Functions Module.
 *  @service.vue
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
      /* Variable zur Zwischenspeicherung des Steppers aus "Einsatz anlegen"  */
      nextStep: 0,
      /* Service-Techniker Informationen */
      personal_id: "",
      fname: "",
      lname: "",
      email: "",
      /* Variablen zum Aufrufen der Dialoge */
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog6: false,
      dialog7: false,
      snackbar: false,
      errorMsg: null,
      /* Variablen zur Zwischenspeicherung von Inputs / ID's */
      delete_service: null,
      check_Service: null,
      check_customer: null,
      selectedProject: null,
      selectedService: null,
      selectedService1: null,
      get_service: null,
      single_services: [],
      /* Einblendung der Benachrichtigung mit Timeout */
      infoText: null,
      timeout: 4000,
      /* Array um Daten für ein Projekt zu speichern/auszulesen */
      services: [],
      myservices: [],
      newService: [
        {
          project_id: null,
          tt_start: null,
          tt_end: null,
          wh_start: null,
          wh_end: null,
          job_description: null,
          personal_id: null,
          service_ispaid_id: 1
        }
      ],
      customerProjects: []
    };
  },
  /**
   * Einsatzdaten beim Laden der Seite direkt auslesen und in der Tabelle einfügen,
   * & Kontrolle ob der JasonWebToken erstellt worden ist. Wenn nicht Redirect zur Loginseite.
   * GET-Methode um Informationen zu Service Technikern aus dem Token im Local Storage auszulesen
   */
  mounted() {
    this.updateServiceDisplay();
    this.getTime();
    axios
      .get("http://localhost:5000/getservicetechniciandata", {
        headers: { token: localStorage.getItem("token") }
      })
      .then(res => {
        this.personal_id = res.data.personal_id;
        this.email = res.data.email;
        this.fname = res.data.fname;
        this.lname = res.data.lname;
      });
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  /**
   * Create- / Update- / Delete-Funktion für die Einsatzverwaltung.
   * Vor der Update- und Delete-Funktion wird duch findProjectByID geprüft ob die ausgewählte ID existiert.
   */
  methods: {
    createService() {
      let addNewService = {
        project_id: this.selectedProject,
        date: this.getDate,
        tt_start: this.newService.tt_start,
        tt_end: this.newService.tt_end,
        wh_start: this.newService.wh_start,
        wh_end: this.newService.wh_end,
        job_description: this.newService.job_description,
        personal_id: this.personal_id,
        service_ispaid_id: 1,
      };
      if (this.$refs.form.validate()) {
        axios
          .post("http://localhost:5000/createService", addNewService)
          .then(response => {
            this.dialog = false;
            this.snackbar = true;
            this.infoText = "[INFO] Ein Einsatz wurde erfolgreich angelegt.";
            this.updateServiceDisplay();
            this.getServiceTechnicianService();
          })
          .catch(error => {
            console.log(error);
          });
        return;
      }
    },
    /**
     * Ein Array mit den veränderten Daten wird an die UpdateService - Route übergeben
     */
    updateService() {
      this.dialog3 = false;
      let changeService = {
        tt_start: this.newService.tt_start,
        tt_end: this.newService.tt_end,
        wh_start: this.newService.wh_start,
        wh_end: this.newService.wh_end,
        job_description: this.newService.job_description
      };
      axios
        .put(
          "http://localhost:5000/updateservice/" + this.check_Service,
          changeService
        )
        .then(response => {
          this.dialog4 = false;
          this.snackbar = true;
          this.infoText = "[INFO] Ein Einsatz wurde bearbeitet.";
          this.updateServiceDisplay();
          this.getServiceTechnicianService();
        })
        .catch(error => {
          console.log(error);
        });
    },
    // Funktion: deleteService um einen Einsatz zu löschen
    deleteService() {
      axios
        .delete("http://localhost:5000/deleteservice/" + this.delete_service)
        .then(response => {
          this.dialog2 = false;
          this.snackbar = true;
          this.infoText = "[INFO] Ein Einsatz wurde gelöscht.";
          this.updateServiceDisplay();
          this.getServiceTechnicianService();
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Es wird über überprüft ob der eingegeben Kunde existiert und anschließend der Dialog fortgeführt / erneut eingeblendet.
     */

    findServiceById() {
      axios
        .get("http://localhost:5000/existservice/" + this.check_Service)
        .then(response => {
          // Wenn der Einsatz existiert, folgt der Dialog mit den zu änderenden Daten
          if (response.data == true) {
            this.dialog3 = false;
            this.dialog4 = true;
          } else {
            this.dialog3 = true;
            this.dialog4 = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Es wird überprüft ob der eingegeben Kunde existiert und anschließend der Dialog fortgeführt / erneut eingeblendet.
     * Anschließend werden die Projekte für einen Kunden zum auswählen für das anlegen eines Einsatzes übergeben.
     */
    findCustomerById() {
      axios
        .get("http://localhost:5000/existcustomer/" + this.check_customer)
        .then(response => {
          if (response.data == true) {
            this.nextStep = 2;
            axios
              .get(
                "http://localhost:5000/getProjectByCustomer/" +
                  this.check_customer
              )
              .then(response => {
                this.customerProjects = response.data;
                console.log(this.customerProjects)
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            this.nextStep = 1;
          }
        })
        .catch(error => {
          this.errorMsg = "Bitte geben Sie eine gültige Kundennummer an.";
        });
    },
    /**
     * Hier werden alle Einsätze des eingeloggten Service Technikers unter "Meine Einsätze" ausgegeben.
     */
    getServiceTechnicianService() {
      axios
        .get(
          "http://localhost:5000/getservicetechnicianservice/" +
            this.personal_id
        )
        .then(response => {
          if (response.data != null) {
            this.myservices = response.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /*
     * handlerFunction zum identifizieren des ausgewählten Projekts + Weiterleiten zum nächsten Dialog.
     */
    handlerFunction(project) {
      this.selectedProject = project.project_id;
      console.log(this.selectedProject);
      this.nextStep = 3;
    },
    /**
     * Die ID des Einsatzes wird an die updatePayment - Route übergeben um den Status auf "Bezahlt" zu setzen.
     */
    updatePayment(services) {
      this.selectedService = services.service_id;
      let updateState = {
        service_ispaid_id: 2
      };
      axios
        .put(
          "http://localhost:5000/updateserviceispaid/" + this.selectedService,
          updateState
        )
        .then(response => {
          this.dialog6 = false;
          this.snackbar = true;
          this.infoText = "[INFO] Ein Einsatz wurde als bezahlt markiert.";
          this.updateServiceDisplay();
          this.getServiceTechnicianService();
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Aktualisierung der Einsätze durch einlesen der erneuerten Daten.
     */
    updateServiceDisplay() {
      axios
        .get("http://localhost:5000/getallservice")
        .then(response => {
          this.services = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Schließen der  Hinzufügen-/Bearbeiten-/Löschen-Dialoge und Aktualisierung der Einsätze.
     */
    closeDialog() {
      this.updateServiceDisplay();
      this.dialog = false;
      this.dialog2 = false;
      this.dialog3 = false;
      this.dialog4 = false;
      this.dialog6 = false;
    },
    getTime() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      this.getDate = date;
    }
  }
};
</script>