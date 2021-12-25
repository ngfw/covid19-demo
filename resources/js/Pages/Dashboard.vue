<template>
  <Head title="Dashboard" />

  <BreezeAuthenticatedLayout>
    <template #header>
      <h2 class="ml-32 text-xl font-semibold leading-tight text-gray-800">
        Covid 19 Dashboard
      </h2>
    </template>

    <div class="py-12">
      <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
          <div class="p-6 bg-white border-b border-gray-200">
            Hello {{ $page.props.auth.user.name }}
          </div>

          <div class="flex h-min-96">
            <div class="w-1/2">
              <div id="map" class="relative h-full w-max h-min-96"></div>
            </div>
            <div class="w-1/2 p-4">
              Select Country To Add:
              <Select2
                class="inline py-2 mx-2"
                v-model="selected_country"
                :options="dropdown_countries"
                :settings="{
                  width: '300px',
                  ajax: {
                    url: '/api/countries',
                    dataType: 'json',
                    processResults: function (data) {
                      return {
                        results: data.map(function (item) {
                          return {
                            id: item.id,
                            text: item.name,
                          };
                        }),
                      };
                    },
                  },
                }"
                @select="dropdownSelectEvent($event)"
              />
              <a
                href="javascript:void(1);"
                @click="addCountry"
                class="inline-block px-3 py-0 bg-green-400 rounded shadow  shadow-neutral-800 hover:bg-green-600"
                >Add</a
              >

              <div
                v-for="(country, index) in countries"
                :key="index"
                class="relative flex flex-col p-2 mt-4 mb-3 rounded shadow"
              >
                <h4
                  class="w-full p-2 mb-5 text-4xl text-indigo-600 nt-semibold"
                >
                  {{ index }}
                </h4>
                <a
                  v-if="index !== 'Global' && index !== 'India'"
                  href="javascript:void(0);"
                  @click="removeCountry(index)"
                  title="Remove Country"
                  class="absolute p-2  rounded-half pointer top-5 hover:shadow-rose-900 hover:shadow hover:bg-red-200 right-5"
                >
                  <img
                    class="w-6"
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAADq0lEQVRIibWWy2tcVRyAv/vIjM04TTqNecc0tio+Yi1SJYWCFIsrcdmduhCKCwuFFncSujUbI/gHFBTsomBEsUi0gcQScWxSk2pr0poQ24ltMnPn3rkz93WOizzMzL2TBJ357c459/y+8/rOuQrA8PvDcSeeHABVp64h/LhjXjvzyRlnDdTc+kFHW8u5xsZHgnpibbuorS6vDAEXdABNU1OHnulLtrQ/Vk8uDzMPSD/MpgDWZiyll1sxEELWFZzP5pHgboKtovfxzJ1b78Qbk3tVRakLXUipOLaZD+xgGEDZaLjw6RcjR197/Y3E3qZ6cLHyBj+PXhn58L1TbwKoGw2B8KdtM18XKIBt5hG+P71R3gS7Jfu6aRileoELhlFyHHsqBFYkc2Z21awXOJ9dNYWq/7FR3rwwYgUxZ+Wz/m6S3Luf5dvvbiCk5OSJfnp79u/Yp2DkgiDQ7myUN2c8OHja9hzX2ylBseRy+as0q7kCOcPmy6/TmNbOO+S6jjt0/q1CCAwghLCEENsmmJldQtMUWvYn6WhvxnV9xiZ+37aPEAIpgrJtLLubVZT5omU+u51SR196gp7uFJ4vaNA1Prv0I7du3+NIfy9dnfsi+9iWiVTU+XLWlthOKSkli0srZJYN2tua6elK0d7WxAvP9SAl+H71a94287BFpRB4O6V+nV3i0uVJJtNlA+fkied59+1X6e5KIavceZUqhcDVlHJdn4nJ2wB0dYSXs7mpEU1TGR2bxXXCYlSqBBV7XE2p9NSfFAoO+5oTHDncG0rsB4KLn4+TzVkkGuMMvHyorN3KZf2tKoVmXE2puwsPAIjHG/j+6k3SU3cBKDkeo1dn+WHsJrGYhpT/frs1PM/1tqoUAkO0Ut3rpzWznGN6ZpF4vAGAaz/Ncf3GAtMzi2SWDQAe705V5gupBBVLvTaSsFLHjz1NV2eKzN8Gwhd46yf4+MBTxGM6gS9QdZWOtib6elvL8kWpFAleV6rseVQUhYN9rRzsK0+q6xrHXnmyMkU52MyD501V1oeWutavVMEwSo5bnK6sD4Fr/UpFqRQJjhXEnGXkava3GaVSJHhw8LTtuY5bK3CUShBxuABilq//NjJarAU4ZvmRjMjKRy3d7T98YE8twL9MrC7vGqwoynwimTiQSCb+F9TKWyioc7sGO7Z1dvzK+DedvZ17GmK6EvXNTuG6gby/8FfRtopno9qrJv3o3MWEVMSLilT+05JLRRYVqU6dHwofLIB/AICB9N+PzXxWAAAAAElFTkSuQmCC"
                  />
                </a>
                <div class="flex items-stretch gap-4">
                  <div
                    v-if="country.confirmed_yesterday"
                    class="items-center w-1/3 p-5 text-center bg-orange-100 rounded shadow "
                  >
                    <img
                      class="w-12 m-auto"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAEQElEQVRoge2XT2hcVRTGf+fNmGbexJg01oVCRZAqigup/xrBCNKFCxEymYKWtBahu9TW2kldGId00SStprEbqQilKdlMQrWCbsSNNkJFpGgpdlGo6KrGpsnMe2aSucdFM5P3Zt7YzGQmUJhvd75z7jnfue/+e9BAAw000EADdzGkXonTscSYwD4AEf3Onjz2Sj3q1KUBfbVvg2NH/gI6lqmsbZuNMn48U+taVq0TAri2/Tor4gGa0unw8/WoVZcGVHRPSSHJddajVs0bcOIHHkLZXuIQ2VbrWlCHBjQX3gOEAlydmkzWvF5NEyoIIrvLuNvSl+cfr2U9qHED6Z7DXcCjZYuZ8Iu1rAcQriTYiR06psh7AIqMtkwNv+v1Wya3B/GdzFmgqWCpbgM+q1ptAFb9Bdz4oS5FCoIF3aVvJZvz9szOvlZEenyDVI57TRFqfhKtqoHZNw+3GyNniuI7MnNud95oXrDfAGyP/7qzpEPAUp5Q2DIff3/TGjX7ENZ4ssnVzBFV6UVQUcYjlj0gqWS2ELRgPgU2lw7XvcDEsjr/2S+c3nR+ZD4TS1wCtuZZy5gXgK8qFVpOZ9g1zqAiCQBncgSgf2HLc/2ZWOKOSUXomo8ffAITFlDvTashtc4sB02jurUwBtNZroFMT+IDlMEg3+ylr1m6ehEAO5ZAod81DpbCruLg3PXf7ii+IMiE3g4V37zCt81TQ9cARM2PXpdBAvfBzM6+VpT95erkrl8u4RR2Wwhaqqrs1kijJP1a2a1Kry+xkdMrqawLRfHP6t699xQnbv430gdsLFc4+NkpOUuU8WI6tPnJ4CTKftt1h4AbHrYDeMBj34qGsufyRiQ1/Afwp8cfcW+2Pe1LG0+2/N/sl9MkmPFwxLIHXOOgQq/dkyBoExcjHes/K+iBYK+eldSo62NgWmBHgcjRCVzMm45x3kG43zNkNpvLPtL+xYlZT5NN7lMvD6rc/tq3dUY/rOp/YC6eeCxkuELQh7WsZ6KpoZ+9lNOd2K/C6AojqejU8I5lYS2Oca4BK8erMBCdHDmyGi1VPSVaUyO/K3wf4Pq1WDwAIaZ9tmjhSeFoZh9e8XAru5Q9uVotFT0l/CI4hfKSn9LPg0Ij7bO/ODNtDvmLTnnQ7T74cHNU/nYcKVr7+rF36dwJVT/mohl3Ev9mzuas8ERQrJw6tajKT15OxerMZKyS2V/cEFr17MMaGpBvTi4octbDfHlv6uiNsvGWfxmpynYR/AeBMto2MXSzIh2VBK8FmVj/a6DnPZTBP4ElJ89qUJd/4iDkjDUNvkvTX1sYq1R8aZI6ovXc0RmBq2XctxabrLFq8q5bAwCKXAj2yFilaz+PdW0A8T/slsm5JStb1ezDOjdgxEyXkKpj96VG/6k257o20JL66ArgEStzS6HFE2vJua4NCCjCDx7ik7XMfgMNNNBAAw3c9fgPn8SB1975NEIAAAAASUVORK5CYII="
                    />
                    <br />{{
                      formatNumber(
                        country.confirmed - country.confirmed_yesterday
                      )
                    }}
                    <br />Active Cases
                  </div>
                  <div
                    v-if="country.confirmed_yesterday"
                    class="items-center w-1/3 p-5 text-center bg-green-100 rounded shadow "
                  >
                    <img
                      class="w-12 m-auto"
                      src="data:image/png;base64,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"
                    />
                    <br />{{
                      formatNumber(
                        country.confirmed -
                          (country.confirmed - country.confirmed_yesterday) -
                          country.deaths
                      )
                    }}
                    <br />Recovered
                  </div>

                  <div
                    class="items-center w-1/3 p-5 text-center bg-red-100 rounded shadow "
                  >
                    <img
                      class="w-12 m-auto"
                      src="data:image/png;base64,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"
                    />
                    <br />{{ formatNumber(country.deaths) }} <br />Deaths
                  </div>

                  <div
                    class="items-center w-1/3 p-5 text-center rounded shadow  bg-cyan-100"
                  >
                    <img
                      class="w-12 m-auto"
                      src="data:image/png;base64,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"
                    />
                    <br />{{ formatNumber(country.confirmed) }} <br />Confirmed
                    Cases
                  </div>
                  <div
                    v-if="!country.confirmed_yesterday"
                    class="items-center w-1/3 p-5 text-center bg-gray-100 rounded shadow "
                  >
                    <img
                      class="w-12 m-auto animate-spin opacity-70"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAAE6klEQVRoge2a34tVVRTHPzeaenAKlUazorw3BiV6COshqKwgCkKbGvoxVBCNA1kK/kjroYcKhKhI+hckoUaD6g+ooNLUrJcgk2K0QLMyR+feoRlnureHda7cu89e5+yzzz6XeThfWDB7ztrrx92/1lp7Q4kSJUqUWLioFCx/OXA/cCewGqgCA8Ci6Ps08DdwAjgGHAK+BP4q2K6gWApsBg4DLQ9qIo5vimQtWFwH7AYa+DlqozrwHrCih36k4nJgCzBFOEdNmgbeAK7okU8qBoEf0A2dBw4Au4Bh4BZgCdCX0CeJjgI398QzC4aAC4phJ4EdyDTX4Dva54H1wb1JwRgyeqYxZ4ANyAimIc8UnwNGg3mTgjFkJzWN2AMsziAn77pu0gOnh4iP7CzwvIesEJvZHLDO25sUDBJfsw3gQU95oXbw80DN0wYVfcR341ncnV0DvIlEUccIe1a3gO+Q4zEYdlqUpE3jCvA48HMAh1xoWwhHQY4Wc0T2pPSpAgcLdM5GU8C1+d2VcLFT8J9I8KDhroinl8626Z28zi4lProbEvjXImvbNGQG+BAYAVYh2dKi6O8R4COlX1aqkzwYqdhsCDyJHlRUkVTPNGIcWOmgqwrss/TPSi9mc7EbRwxhOxS+CvE1O48kFVmxFXsU50rfeugEYBndEdV/wPUK7xMWxT7OtrHdIs+VmkjhITNGDEEHFL4K8aNn3Eehgf34O/2kj8L3DSG7FL41Bt8Mbms2DTX8N7LdmtDLEhSuMtrfK3xDRvsTZHPLiwngU8++pu2XkOTwoNE+rvCtNdqfuVjkCF9Zpu2XkOSweZ6dUfjMjeyoi0WO0GZVGrzOYnP9aPWkusHX76NMQT9+a3hGE5g0wq5oBZChIYR9zgIbRlsbuT+MdlIdKyt8ZdW1D0kOnzPaWm34lNG+3cUiR/jKmtQ+JDn8q9HWtvqvjLZ5TOXBI579ftE+JDlsHkPar20eHY8hiUBe1IBHPftqR2ginqJ75zuo8FWQsk0n7z4fhQY+xm+HbiGxfWbYkocbFN5hi9KtPkojvGyRlyV5GPBVfMgQtlPhqwDfGLzz+NWZtpMvPdSSHCdsMoT9hl4AuAl7aWc/bmXUGvZpfBbJ3CYs32y0MZuL3bCVeMYS+O9BohzTiFkkZXwauRjvj2h19L9x7JnRNHBfJPtqYG+Ks1PkLPGA3M92Ck0r4t1NmCLeP8C9FvnPIMV3W5+3vb3swAri8fIHKX1WEl/TWehrknPqKvKDdPa5gGy0QWDbNZOmdhvDwE+Wvhr9CDxL+tuTbZa+eUpKMfQhaV+ngovAQ479bwNeBz5Hzuw68C9wOvrfW8jDF5dHNuuRS7ROWw4T+KoF5ObdXDsN3J0OgSHim9skYSI7K2y/7kXcpndebIl0deqeAx4uWvEo9gvxvRTzzGgZ9gJ9E3iuAH1WjBIf6RbyoOwFwry2uRIJfM5Z9MzRQ2fbWId+Hv4OvIJeuE/CjcBrSGHBJnuSHNM479PDGhIl3aF8byKX1V8gF+rHkYJBA0lNFwPXALciO/kDSJ1bs+sIEmaeyGl3LrQfpmlPmEJQA3iVAo6ePFgOvEs8KstDU0i4GCyCKgJLgJeQWzzbbp5GTSTF20iARMBE0c+HB+h+PlxD1uxV0fc6kv5N0P18+GzBdpUoUaJEiQWJ/wESfYbFYZOjcQAAAABJRU5ErkJggg=="
                    />
                    <br />Loading...
                  </div>
                </div>
              </div>

              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </BreezeAuthenticatedLayout>
</template>

<script>
import BreezeAuthenticatedLayout from "@/Layouts/Authenticated.vue";
import { Head } from "@inertiajs/inertia-vue3";
import axios from "axios";
import moment from "moment";
import Select2 from "vue3-select2-component";

export default {
  name: "Dashboard",
  components: {
    Select2,
    BreezeAuthenticatedLayout,
    Head,
  },
  data() {
    return {
      loading: false,
      yesterday: false,
      baseEndpoint: "https://covid19.mathdro.id/api",
      iStatesEndpoint: "https://data.covid19india.org/state_district_wise.json",
      dropdown_countries: [],
      countries: {},
      selected_country: 0,
      selected_country_name: "",
      bubbles: [],
    };
  },
  methods: {
    initMap() {
      let dt;
      fetch(this.iStatesEndpoint)
        .then((response) => response.json())
        .then((result) => {
          const output = {};
          let total = 0;
          Object.entries(result).map(([k, s]) => {
            output[s.statecode] = 0;
            for (let value of Object.entries(s.districtData)) {
              if (value[1].active > 0) {
                output[s.statecode] += value[1].active;
              }
            }
          });
          for (let value of Object.entries(output)) {
            total += value[1];
          }
          for (let value of Object.entries(output)) {
            if (value[0] !== "LA" && value[0] !== "UN") {
              this.bubbles.push({
                centered: value[0],
                fillKey: "MINOR",
                radius: Math.round((value[1] / total) * 100) + 5,
                state: value[0],
              });
            }
          }
          setTimeout(() => {
            window.bubble_map.bubbles(this.bubbles, {
              popupTemplate: function (geo, data) {
                return `<div class="hoverinfo">State: ${
                  data.state
                }, Active Cases: ${data.radius - 5}%</div>`;
              },
            });
          }, 2500);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async getCountryCovidData(country) {
      this.loading = true;
      return fetch(
        country === "Global"
          ? this.baseEndpoint
          : this.baseEndpoint + "/countries/" + country
      )
        .catch(() => {
          this.loading = false;
        })
        .then((response) => response.json())
        .then((response) => {
          this.countries[country] = {
            confirmed: response.confirmed.value,
            confirmed_yesterday: 0,
            deaths: response.deaths.value,
            recovered: response.recovered.value,
            lastUpdate: moment(response.lastUpdate).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
          };
        });
    },
    async getyesterday() {
      const tempYesterday = moment()
        .subtract(2, "days")
        .startOf("day")
        .format("M-D-YYYY");
      return fetch(this.baseEndpoint + "/daily/" + tempYesterday)
        .then((res) => res.json())
        .then((res) => {
          this.yesterday = res;
        });
    },
    async getYesterdayConfirmedCases() {
      if (!this.yesterday) {
        await this.getyesterday();
      }
      Object.entries(this.countries).map(([k, c]) => {
        this.countries[k].confirmed_yesterday = 0;
      });

      for (let data of this.yesterday) {
        if (
          typeof this.countries[data.countryRegion] !== "undefined" &&
          data.confirmed.length > 0
        ) {
          this.countries[data.countryRegion].confirmed_yesterday += parseInt(
            data.confirmed
          );
        }
      }
    },
    async getGlobalYesterdayConfirmedCases() {
      if (!this.yesterday) {
        this.getyesterday();
      }
      Object.entries(this.yesterday).map(([k, c]) => {
        this.countries.Global.confirmed_yesterday += parseInt(c.confirmed);
      });
    },
    dropdownSelectEvent({ id, text }) {
      this.selected_country_name = text;
      // it's faster to add country at the selection, but UI requires button
      // this.addCountry();
    },
    addCountry() {
      if (this.selected_country.length) {
        axios
          .post("/api/add-country", {
            id: this.selected_country,
          })
          .then((response) => {
            this.getCountryCovidData(this.selected_country_name);
            setTimeout(() => {
              this.getYesterdayConfirmedCases();
              setTimeout(() => {
                this.getGlobalYesterdayConfirmedCases();
              }, 100);
            }, 1000);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    removeCountry(index) {
      axios
        .post("/api/remove-country", {
          name: index,
        })
        .then(() => {
          delete this.countries[index];
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    formatNumber(number) {
      return Intl.NumberFormat().format(number);
    },
    async getUserCountries() {
      return axios
        .get("/api/get-user-countries")
        .then((response) => {
          response.data.map((name) => {
            setTimeout(() => {
              this.getCountryCovidData(name);
            }, 300);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    this.initMap();
    this.getCountryCovidData("Global");
    this.getCountryCovidData("India");
    this.getUserCountries();
    setTimeout(() => {
      this.getYesterdayConfirmedCases();
      setTimeout(() => {
        this.getGlobalYesterdayConfirmedCases();
      }, 2000);
    }, 1200);
    window.waitForElm("map").then((elem) => {
      setTimeout(() => {
        if (!window.isMapRegistered) {
          window.setupDatamaps(elem);
        }
      }, 1000);
    });
  },
};
</script>
