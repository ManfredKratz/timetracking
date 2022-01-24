<script>
/*
 *  Personal Functions Module.
 *  @personal.vue
 */
import axios from "axios";

export default {
  name: "Personal",
  data() {
    return {
      /* Input Regeln für Error-Messages */
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben."
      },
      /* Variablen zum Aufrufen der Dialoge */
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      snackbar: false,
      /* Variablen zur Zwischenspeicherung von ID's */
      delete_Personal: null,
      check_Personal: null,
      /* Einblendung der Benachrichtigung mit Timeout */
      infoText: null,
      timeout: 4000,
      /* Array um Daten für Personal zu speichern/auszulesen */
      Personal: [],
      newPersonal: [
        {
          fname: null,
          lname: null
        }
      ],
      /* Kundentabellen - Kopfzeilen */
      search: "",
      headers: [
        {
          text: "Personal ID",
          align: "left",
          sortable: false,
          value: "personal_id"
        },
        { text: "Vorname", value: "fname" },
        { text: "Nachname", value: "lname" },
        { text: "E-Mail Adresse", value: "email" }
      ]
    };
  },
  /**
   * Kundendaten beim Laden der Seite direkt auslesen und in der Tabelle einfügen,
   * & Kontrolle ob der JasonWebToken erstellt worden ist. Wenn nicht Redirect zur Loginseite.
   */
  mounted() {
    this.updatePersonalTable();
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  /**
   * Update- / Delete-Funktion für die Personalverwaltung.
   * Vor der Update- und Delete-Funktion wird duch findPersonalByID geprüft ob die ausgewählte ID existiert.
   */
  methods: {
    /**
     * Aktualisierung der Personaltabelle durch einlesen der erneuerten Daten.
     */
    updatePersonalTable() {
      axios
        .get("http://localhost:5000/getallservicetechnician")
        .then(response => {
          this.Personal = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Schließen der  Hinzufügen-/Bearbeiten-/Löschen-Dialoge und Aktualisierung der Persoanltabelle.
     */
    closeDialog() {
      this.updatePersonalTable();
      this.dialog = false;
      this.dialog2 = false;
      this.dialog3 = false;
      this.dialog4 = false;
    }
  }
};
</script>