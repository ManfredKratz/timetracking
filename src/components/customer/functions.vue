<script>
/*
 *  Customer Functions Module.
 *  @customer.vue
 */

/* AXIOS Promise based HTTP client */
import axios from "axios";

export default {
  name: "functions",
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
      /* Variablen zur Zwischenspeicherung von ausgewählten ID's */
      delete_customer: null,
      check_customer: null,
      /* Einblendung der Benachrichtigung mit Timeout */
      infoText: null,
      timeout: 4000,
      /* Arrays zum Zwischenspeichern von Kundeninformationen */
      customer: [],
      newCustomer: [
        {
          company: null,
          street: null,
          postal_code: null,
          location: null,
          fname_poc: null,
          lname_poc: null,
          billing_id: null
        }
      ],
      /* Kundentabellen - Kopfzeilen */
      search: "",
      headers: [
        {
          text: "Kunden ID",
          align: "left",
          sortable: false,
          value: "customer_id"
        },
        { text: "Firma", value: "company" },
        { text: "Straße", value: "street" },
        { text: "PLZ", value: "postal_code" },
        { text: "Ort", value: "location" }
      ]
    };
  },
  /**
   * Kundendaten beim Laden der Seite direkt auslesen und in der Tabelle einfügen,
   * & Kontrolle ob der JasonWebToken erstellt worden ist. Wenn nicht Redirect zur Loginseite.
   */
  mounted() {
    this.updateCustomerTable();
  },
  created() {
    if (!localStorage.getItem("token")) {
      this.$router.push("/");
    }
  },
  /**
   * Create- / Update- / Delete-Funktion für die Kundenverwaltung.
   * Vor der Update- und Delete-Funktion wird duch findCustomerByID geprüft ob die ausgewählte ID existiert.
   */
  methods: {
    /**
     * Ein Array mit den eingetragenen Kundendaten wird an die createCustomer - Route übergeben.
     */
    createCustomer() {
      let addNewCustomer = {
        company: this.newCustomer.company,
        street: this.newCustomer.street,
        postal_code: this.newCustomer.postal_code,
        location: this.newCustomer.location,
        fname_poc: this.newCustomer.fname_poc,
        lname_poc: this.newCustomer.lname_poc
      };
      if (this.$refs.form.validate()) {
        axios
          .post("http://localhost:5000/createcustomer", addNewCustomer)
          .then(response => {
            this.dialog = false;
            this.snackbar = true;
            this.infoText = "[INFO] Ein Kunde wurde erfolgreich angelegt.";
            this.updateCustomerTable();
          })
          .catch(error => {
            console.log(error);
          });
        return;
      }
    },
    /**
     * Ein Array mit den veränderten Daten wird an die UpdateCustomer - Route übergeben
     */
    updateCustomer() {
      this.dialog3 = false;
      let changeCustomer = {
        street: this.newCustomer.street,
        postal_code: this.newCustomer.postal_code,
        location: this.newCustomer.location,
        fname_poc: this.newCustomer.fname_poc,
        lname_poc: this.newCustomer.lname_poc
      };
      axios
        .put(
          "http://localhost:5000/updatecustomer/" + this.check_customer,
          changeCustomer
        )
        .then(response => {
          this.dialog4 = false;
          this.updateCustomerTable();
          this.snackbar = true;
          this.infoText = "[INFO] Kundeninformation aktualisiert.";
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Aktualisierung der Kundentabelle durch einlesen der erneuerten Daten.
     */
    updateCustomerTable() {
      axios
        .get("http://localhost:5000/getallcustomer")
        .then(response => {
          this.customer = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * Es wird über überprüft ob der eingegeben Kunde existiert und anschließend der Dialog fortgeführt / erneut eingeblendet.
     */
    findCustomerById() {
      if (this.$refs.form1.validate()) {
        axios
          .get("http://localhost:5000/existcustomer/" + this.check_customer)
          .then(response => {
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
        return;
      }
    },
    /**
     * Schließen der  Hinzufügen-/Bearbeiten-/Löschen-Dialoge und Aktualisierung der Kundentabelle.
     */
    closeDialog() {
      this.updateCustomerTable();
      this.dialog = false;
      this.dialog2 = false;
      this.dialog3 = false;
      this.dialog4 = false;
    }
  }
};
</script>