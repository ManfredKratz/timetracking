<template>
  <v-app>
    <!-- Leiste über Content mit Unternehmensnamen + Logo -->
    <v-app-bar app flat>
      <!-- Burgermenü Button mit Toggle-Funktion -->
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          id="Logo"
          alt="Logo"
          class="shrink mr-2"
          contain
          src="../src/assets/Logo.png"
          transition="scale-transition"
          width="25"
        />
        <div class="display-1 subtitle-1 font-weight-Medium">
          G. M.
          <b>Kugellager</b>
        </div>
      </div>
      <v-spacer></v-spacer>
      <!-- Wenn der Nutzer eingeloggt ist, kann er sich rechts oben in der Leiste ausloggen -->
      <template v-if="isLoggedIn == true">
        <v-btn x-small color="#404040" text @click="logout">
          <v-icon small>mdi-exit-to-app</v-icon>Logout
        </v-btn>
      </template>
    </v-app-bar>
    <template v-if="isLoggedIn == true">
      <!-- Hauptnavigation links mit Nutzernamen + Toggle der Navigation -->
      <v-navigation-drawer app color="#0749AB" v-model="drawer" width="260">
        <v-list color="#0747A6">
          <v-list-item two-line dark>
            <v-list-item-content>
              <v-list-item-title class="title">{{fname}} {{lname}}</v-list-item-title>
              <v-list-item-subtitle>{{email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <!-- Content der Navigation als Liste mit Icons -->
        <v-list nav dense color="#0749AB" dark>
          <v-list-item link to="/service">
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Einsatzverwaltung</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/projects">
            <v-list-item-icon>
              <v-icon>mdi-folder-text-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Projektverwaltung</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/customer">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Kunden</v-list-item-title>
          </v-list-item>
          <v-list-item link to="/personal">
            <v-list-item-icon>
              <v-icon>mdi-account-supervisor-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Personal</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </template>
    <v-content>
      <main>
        <!-- Router-Verweis um Content in die App zu rendern -->
        <router-view></router-view>
      </main>
    </v-content>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      /* Variablen zur Zwischenspeicherung */
      drawer: true,
      linkTo: false,
      personal_id: "",
      fname: "",
      lname: "",
      email: "",
      isLoggedIn: false
    };
  },
  /**
   * GET-Methode um Informationen zu Service Technikern aus dem Token im Local Storage auszulesen
   */
  mounted() {
    axios
      .get("http://localhost:5000/getservicetechniciandata", {
        headers: { token: localStorage.getItem("token") }
      })
      .then(res => {
        this.personal_id = res.data.personal_id;
        this.email = res.data.email;
        this.fname = res.data.fname;
        this.lname = res.data.lname;
        this.isLoggedIn = true;
      });
  },
  /**
   * Logout Funktion mit Weiterleitung zur Loginpage
   */
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/");
      this.isLoggedIn = false;
    }
  }
};
</script>

<!-- Style-Section -->
<style>
.spacing {
  margin-bottom: 20px;
}
.blueLine {
  display: flex;
  background-color: #0749ab;
  justify-content: center;
  padding: 0.09em;
}

.errorMsg {
  color: #ff526c;
  font-size: 12px;
  margin-top: -20px;
}
</style>