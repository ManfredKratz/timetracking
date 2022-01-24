<template>
  <v-app>
    <main>
      <v-layout justify-center align-center>
        <!-- Die Anwenderinformation gibt Auskunft darüber, wo der Anwender sich befindet -->
        <v-card class="mt-10" color="white" max-width="600">
          <v-toolbar dark flat color="#0747A6">
            <v-icon left>mdi-account-plus</v-icon>
            <v-toolbar-title class="subtitle-1">Registrierung</v-toolbar-title>
          </v-toolbar>
          <v-divider></v-divider>
          <!-- Text-Felder zur Eingabe der Anwenderdaten -->
          <v-row justify="center" class="ma-1">
            <v-card-text>
              <v-form ref="form">
                <v-text-field
                  label="Vorname"
                  v-model="fname"
                  prepend-icon="mdi-account-supervisor-circle"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="Nachname"
                  v-model="lname"
                  prepend-icon="mdi-account-supervisor-circle"
                  :rules="[rules.required]"
                ></v-text-field>
                <v-text-field
                  label="E-Mail"
                  v-model="email"
                  prepend-icon="mdi-email"
                  hint="beispiel@anbieter.de"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
                <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  label="Passwort"
                  v-model="password"
                  prepend-icon="mdi-lock"
                  hint="Ihr Passwort muss mindestens 8 Zeichen lang sein."
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :rules="[rules.required, rules.min8Chars]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <!-- Button zum Registrieren durch SignUp-Funktion -->
            <v-card-actions>
              <v-btn
                small
                depressed
                dark
                class="mr-3"
                color="#004790"
                @click="signup()"
              >Registrieren</v-btn>
              <router-link to="/">
                <v-btn small depressed text color="#004790">Zum Login</v-btn>
              </router-link>
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
  name: "Signup",
  data() {
    return {
      /* Überprüfung der Eingaben */
      rules: {
        min8Chars: value =>
          value.length >= 8 ||
          "Ihr Passwort muss mindestens 8 Zeichen lang sein.",
        required: value => !!value || "Bitte ergänzen Sie ihre Angaben.",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return (
            pattern.test(value) ||
            "Sie haben eine ungültige E-Mail Adresse eingegeben."
          );
        }
      },
      /* Variablen zum Zwischenspeichern der Inputs */
      fname: "",
      lname: "",
      email: "",
      password: "",
      error: "",
      showPassword: false,
      drawer: false
    };
  },
  methods: {
    /**
     * Registrierfunktion mit Übergabe der neuen Nutzerdaten und Weiterleitung zum Login.
     */
    signup() {
      let newUser = {
        fname: this.fname,
        lname: this.lname,
        email: this.email,
        password: this.password
      };
      if (this.$refs.form.validate()) {
      axios.post("http://localhost:5000/signup", newUser).then(
        res => {
          if (res.status == 204) {
            this.$router.push("/");
          }
        },
        err => {
          console.log(err.response);
        }
      );
      }
    }
  }
};
</script>

<!-- Style-Section -->
<style >
._headline {
  font-size: 18px;
  font-weight: bold;
}
</style>