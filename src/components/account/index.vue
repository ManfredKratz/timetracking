<template>
  <v-app>
    <main>
      <v-layout justify-center align-center>
        <v-card class="mt-10" color="white" max-width="600">
          <!-- Titel der Page mit Subpage und Trennstrich -->
          <v-toolbar dark flat color="#0747A6">
            <v-icon left>mdi-account-plus</v-icon>
            <v-toolbar-title class="subtitle-1">Authentifizierung</v-toolbar-title>
          </v-toolbar>
          <!-- Text-Felder zur Eingabe der Anmeldedaten -->
          <v-row justify="center" id="spacing">
            <v-card-text>
              <v-layout class="justify-center">
              <div class="errorMsg">{{errorMsg}}</div>
              </v-layout>
              <v-form ref="form">
                <v-text-field
                  label="E-Mail Adresse"
                  prepend-icon="mdi-account-circle"
                  v-model="email"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  label="Passwort"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <!-- Buttons zum Anmelden/Registrieren mit Login- und Weiterleitungsfunktion -->
            <!-- An den Button "Registrieren" ist ein Dialog gebunden, welcher eingeblendet wird beim anklicken -->
            <v-card-actions>
              <v-row>
                <v-dialog v-model="dialog" persistent max-width="390">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      small
                      class="mr-3"
                      dark
                      depressed
                      color="#004790"
                      @click="login()"
                    >Anmelden</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn small depressed text color="#004790" v-on="on">Registrieren</v-btn>
                  </template>
                  <!-- Dialog-Fenster mit Registrationshinweis -->
                  <v-card width="au">
                    <v-card-title class="headline">Sie besitzen keinen Account?</v-card-title>
                    <v-card-text>
                      Um den Service von Georg Müller GmbH nutzen zu können benötigen Sie einen Account. Möchten Sie sich einen erstellen?
                      <br />
                      <br />
                      <b>Hinweis:</b> Nur für Mitarbeiter.
                    </v-card-text>
                    <!-- Dialog-Buttons zum Erstellen eines neuen Accounts -->
                    <v-card-actions>
                      <v-btn text small color="b.ue darken-1" @click="dialog = false">Abbrechen</v-btn>
                      <v-spacer></v-spacer>
                      <router-link class="link" to="/register">
                        <v-btn
                          depressed
                          dark
                          small
                          color="#004790"
                          @click="dialog = false"
                        >Erstellen</v-btn>
                      </router-link>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </v-card-actions>
          </v-row>
        </v-card>
      </v-layout>
    </main>
  </v-app>
</template>

<script>
/* AXIOS Promise based HTTP client */
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      /* Variablen zum Zwischenspeichern der Inputs */
      email: "",
      password: "",
      error: "",
      errorMsg: null,
      showPassword: false,
      dialog: false,
      drawer: false,
      isLoggedIn: false,
      /* Überprüfung der Inputs */
      rules: {
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben."
      }
    };
  },
  /**
   * Kontrolle ob der JasonWebToken erstellt worden ist. Wenn nicht Redirect zur Loginseite.
   */
  created() {
    if (localStorage.getItem("token")) {
      this.$router.push("/service");
    }
  },
  /**
   * Funktion zum übermitteln der Anmeldedaten und setzen des JasonWebToken
   */
  methods: {
    login() {
      let user = {
        email: this.email,
        password: this.password
      };
      if (this.$refs.form.validate()) {
        axios.post("http://localhost:5000/login", user).then(
          response => {
            localStorage.setItem("token", response.data.token);
            this.isLoggedIn = true;
            this.reload();
          })
          .catch(error => {
            error = this.errorMsg ="[FEHLER] Sie haben ungültige Anmeldedaten angegeben.";
            console.log(error);
          });
      }
    },
    /**
     * Funktion um nach erfolgreichem Login auf die Seite der Einsatzverwaltung weitergeleitet zu werden.
     */
    reload() {
      this.$router.go();
      if (this.isLoggedIn == true) {
        this.$router.replace({ name: "service" });
        this.$router.push("/service");
      }
    }
  }
};
</script>

<!-- Style-Section -->
<style scoped>
.v-text-field label {
  font-size: 10px;
}

#spacing {
  margin: 15px;
}
</style>