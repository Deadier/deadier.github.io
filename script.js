// Fonctions de validation pour la latitude, la longitude et le rayon
function isValidLatitude(lat) {
  lat = parseFloat(lat)
  return !isNaN(lat) && lat >= -90 && lat <= 90
}

function isValidLongitude(lon) {
  lon = parseFloat(lon)
  return !isNaN(lon) && lon >= -180 && lon <= 180
}

function isValidRadius(radius) {
  radius = parseFloat(radius)
  const maxRadius = 6371000 // Rayon de la Terre en mètres
  return !isNaN(radius) && radius > 0 && radius <= maxRadius
}

// Fonction pour obtenir l'URL du logo en fonction de l'opérateur
function getOperatorLogoUrl(operator) {
  const logos = {
    "BOUYGUES TELECOM": "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Bouygues_Telecom.svg",
    DIGICEL: "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Digicel.svg",
    "ORANGE CARAIBES": "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Orange_Caraibe.svg",
    ORANGE: "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Orange.svg",
    SFR: "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/SFR.svg",
    "SFR CARAIBES": "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/SFR_caraibe.svg",
    "FREE MOBILE": "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Free_mobile.svg",
    "FREE CARAIBES": "https://cdn.jsdelivr.net/gh/Deadier/deadier.github.io/logos_operateurs/Free_caraibe.svg",
  }
  return logos[operator] || "" // Retourne l'URL du logo ou une chaîne vide si non trouvé
}

// Fonction pour construire l'URL de la carte
function buildMapUrl(operator, latitude, longitude, radius, region) {
  // Traitement des noms d'opérateurs spécifiques pour la région Antilles-Guyane
  if (region === "antilles") {
    if (operator === "SFR CARAIBES") {
      operator = "OUTREMER%20TELECOM" // Remplacer SFR CARAIBES par OUTREMER TELECOM
    } else if (operator === "ORANGE CARAIBES") {
      operator = "ORANGE" // Remplacer ORANGE CARAIBES par ORANGE
    }
  }

  // S'assurer que le nom de l'opérateur est formaté correctement pour une URL
  operator = operator.replace(" ", "%20")

  // Construction de l'URL
  const zoomLevel = calculateZoomLevel(radius)
  return `https://data.anfr.fr/visualisation/frame/map/?id=observatoire_2g_3g_4g&refine.adm_lb_nom=${operator}&refine.statut=En%20service&refine.statut=Techniquement%20op%C3%A9rationnel&geofilter.distance=${latitude},${longitude},${radius}&location=${zoomLevel},${latitude},${longitude}&datasetcard=true&scrollWheelZoom=true`
}

// Fonction pour calculer le niveau de zoom basé sur le rayon
function calculateZoomLevel(radius) {
  // Logique de calcul du niveau de zoom basée sur le rayon
  radius = parseFloat(radius)
  if (radius <= 35) {
    return 20
  } else if (radius <= 70) {
    return 19
  } else if (radius <= 140) {
    return 18
  } else if (radius <= 270) {
    return 17
  } else if (radius <= 550) {
    return 16
  } else if (radius <= 1100) {
    return 15
  } else if (radius <= 2200) {
    return 14
  } else if (radius <= 4400) {
    return 13
  } else if (radius <= 8800) {
    return 12
  } else {
    return 11 // Pour les rayons plus grands
  }
}

//Fonction pour afficher le tableau des résultats et le total des pylônes uniques de la zone qui sont initialement masqués
function showResults() {
  document.getElementById("antennasTable").style.display = "table" // Affiche le tableau
  document.getElementById("totalPylonsSection").style.display = "block" // Affiche la section des pylônes
}

// Fonction pour afficher le nom de l'opérateur et récupérer le nombre total d'antennes
function displayOperatorName(
  operator,
  region,
  latitude,
  longitude,
  radius
) {
  const operatorDisplayName = getOperatorDisplayName(operator, region)
  const operatorApiName = getOperatorApiName(operator)
  const generations = ["2G", "3G", "4G", "5G"]

  Promise.all(
    generations.map((generation) => {
      return new Promise((resolve) => {
        getAntennasCountByGeneration(
          operatorApiName,
          latitude,
          longitude,
          radius,
          generation,
          (gen, count) => {
            resolve({ generation: gen, count: count })
          }
        )
      })
    })
  ).then((results) => {
    const totalAntennas = results.reduce(
      (total, current) => total + current.count,
      0
    )
    const detailsByGeneration = results.reduce((details, current) => {
      details[current.generation] = current.count
      return details
    }, {})

    updateAntennaSummary(
      operatorDisplayName,
      totalAntennas,
      detailsByGeneration,
      latitude,
      longitude,
      radius,
      region
    )
  })
}

// Fonction pour mettre à jour le résumé des antennes
async function updateAntennaSummary(
  operator,
  totalAntennas,
  detailsByGeneration,
  latitude,
  longitude,
  radius,
  region
) {
  const tableBody = document
    .getElementById("antennasTable")
    .getElementsByTagName("tbody")[0]
  const newRow = tableBody.insertRow()

  // Colonne Opérateur avec logo
  const cellOperator = newRow.insertCell()

  // Créer l'élément img pour le logo
  const logoImg = document.createElement("img")
  logoImg.src = getOperatorLogoUrl(operator) // Fonction pour obtenir l'URL du logo
  logoImg.alt = `Logo ${operator}`
  logoImg.className = "operator-logo" // Classe pour le style CSS

  // Ajouter le logo et le nom de l'opérateur à la cellule
  cellOperator.appendChild(logoImg)
  cellOperator.appendChild(document.createTextNode(` ${operator}`))
  cellOperator.setAttribute("data-label", "Opérateur")

  // Colonne Total d'antennes
  const cellTotal = newRow.insertCell()
  cellTotal.textContent = totalAntennas
  cellTotal.setAttribute("data-label", "Total d'antennes")

  // Colonnes pour chaque génération (2G, 3G, 4G, 5G)
  Object.entries(detailsByGeneration).forEach(([generation, count]) => {
    const cell = newRow.insertCell()
    cell.textContent = `${count} antennes`
    cell.setAttribute("data-label", generation)
  })

  // Colonne pour le nombre de pylônes
  const pylonsCount = await countPylonsForOperator(
    operator,
    latitude,
    longitude,
    radius,
    region
  )
  const cellPylons = newRow.insertCell()
  cellPylons.textContent = `${pylonsCount} pylônes`
  cellPylons.setAttribute("data-label", "Nombre de pylônes")

  // Colonne pour le bouton Carte
  const detailButton = document.createElement("button")
  detailButton.textContent = "Afficher"
  detailButton.onclick = () =>
    openMapInNewTab(operator, latitude, longitude, radius, region)
  const cellButton = newRow.insertCell()
  cellButton.appendChild(detailButton)
  cellButton.setAttribute("data-label", "Carte")
}

// Fonction pour afficher le nombre d'antennes par génération
function displayAntennasCount(operator, results) {
  const summaryContent = document.createElement("div")
  summaryContent.setAttribute("data-operator", operator)

  let textContent = `${operator}: `
  for (let [generation, count] of Object.entries(results)) {
    textContent += `${generation} - ${count} antennes; `
  }

  summaryContent.textContent = textContent
  //document.getElementById('results-container').appendChild(summaryContent); // Assurez-vous que cet ID existe dans votre HTML
}

//Fonction de gestion des erreurs
function handleError(error) {
  let errorMessage = ""
  if (error.message === "Network response was not ok") {
    errorMessage =
      "Erreur lors de la récupération des données. Veuillez vérifier votre connexion Internet et réessayer."
  } else if (error.name === "AbortError") {
    errorMessage =
      "La requête a expiré. L'API de l'ANFR met trop de temps à répondre. Veuillez réessayer plus tard."
  } else {
    // Mise à jour pour inclure des liens HTML
    errorMessage = `Une erreur est survenue. Veuillez vérifier votre accès Internet et vérifier l'installation et l'activation de l'extension <a href="https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino" target="_blank">CORS Unblock (Chrome)</a>, <a href="https://addons.mozilla.org/fr/firefox/addon/cors-unblock/" target="_blank">CORS Unblock (Firefox)</a>, ou <a href="https://addons.mozilla.org/fr/firefox/addon/access-control-allow-origin/" target="_blank">Allow CORS: Access-Control-Allow-Origin (Firefox Mobile)</a>.`
  }
  return errorMessage
}

// Fonction appelée en cas d'erreur de géolocalisation
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("L'utilisateur a refusé la demande de géolocalisation.")
      break
    case error.POSITION_UNAVAILABLE:
      alert("Les informations de localisation ne sont pas disponibles.")
      break
    case error.TIMEOUT:
      alert("La demande d'obtenir la position de l'utilisateur a expiré.")
      break
    case error.UNKNOWN_ERROR:
      alert("Une erreur inconnue s'est produite.")
      break
  }
}

// Gestion du bouton d'information
document
  .getElementById("infoButton")
  .addEventListener("click", function () {
    var infoSection = document.getElementById("infoSection")

    // Basculer la visibilité de la section d'informations
    if (
      infoSection.style.display === "none" ||
      infoSection.style.display === ""
    ) {
      infoSection.style.display = "block"
    } else {
      infoSection.style.display = "none"
    }
  })

// Ajout d'un écouteur d'événement sur le bouton pour afficher la date de dernière mise à jour des données
document
  .getElementById("updateDateButton")
  .addEventListener("click", function () {
    // Envoi d'une requête à l'API pour récupérer les données
    fetch(
      "https://data.anfr.fr/d4c/api/datasets/2.0/search/facet.field=%5B%22organization%22,%22tags%22,%22themes%22,%22features%22%5D&rows=12&start=0"
    )
      .then((response) => response.json()) // Conversion de la réponse en JSON
      .then((data) => {
        // Recherche du dataset spécifique dans les résultats
        const dataset = data.result.results.find(
          (d) => d.id === "dd11fac6-4531-4a27-9c8c-a3a9e4ec2107"
        )

        // Vérification si le dataset et la section 'resources' existent
        if (dataset && dataset.resources) {
          // Recherche de la ressource spécifique par son ID
          const resource = dataset.resources.find(
            (r) => r.id === "4f2465b9-85b3-48b8-b014-82114988bd40"
          )
          if (resource && resource.last_modified) {
            // Conversion de la date ISO en objet Date
            const date = new Date(resource.last_modified)
            // Formatage de la date en format JJ/MM/AAAA HH:MM:SS
            const formattedDate =
              date.toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }) +
              " " +
              date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            // Affichage de la date formatée
            document.getElementById("lastUpdateDate").textContent =
              "Dernière mise à jour : " + formattedDate
          } else {
            // Message si la date de dernière mise à jour n'est pas trouvée
            document.getElementById("lastUpdateDate").textContent =
              "Date de dernière mise à jour non trouvée dans les ressources"
          }
        } else {
          // Message si le dataset spécifié n'est pas trouvé
          document.getElementById("lastUpdateDate").textContent =
            "Dataset spécifié non trouvé"
        }
      })
      .catch((error) => {
        // Gestion des erreurs et affichage d'un message d'erreur
        console.error(
          "Erreur lors de la récupération de la date de mise à jour",
          error
        )
        document.getElementById("lastUpdateDate").textContent =
          "Erreur lors de la récupération de la date de mise à jour"
      })
  })

// Ajout d'un écouteur d'événement pour le bouton de géolocalisation
document
  .getElementById("geolocateButton")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError)
    } else {
      alert(
        "La géolocalisation n'est pas prise en charge par ce navigateur."
      )
    }
  })

// Écouteur d'événement sur le formulaire pour la soumission
document
  .getElementById("mapForm")
  .addEventListener("submit", function (e) {
    e.preventDefault()

    // Récupération et nettoyage des données de latitude et longitude
    let latitude = document
      .getElementById("latitude")
      .value.replace(",", ".")
    let longitude = document
      .getElementById("longitude")
      .value.replace(",", ".")
    let radius = document.getElementById("radius").value

    // Appel de la fonction pour calculer et afficher le nombre total de pylônes
    calculateAndDisplayTotalPylons(latitude, longitude, radius)

    // Validation des entrées
    if (!isValidLatitude(latitude)) {
      alert("Veuillez entrer une latitude valide (entre -90 et 90).")
      return
    }
    if (!isValidLongitude(longitude)) {
      alert("Veuillez entrer une longitude valide (entre -180 et 180).")
      return
    }
    if (!isValidRadius(radius)) {
      alert(
        "Veuillez entrer un rayon positif et inférieur à 6 371 kilomètres."
      )
      return
    }

    // Détermination de la région et sélection des opérateurs correspondants
    const region = document.querySelector(
      'input[name="region"]:checked'
    ).value
    let operators = determineOperators(region)

    // Réinitialisation de la section des pylônes avec le message de chargement
    document.getElementById("totalPylons").textContent =
      "Patientez, chargement en cours ..."

    // Réinitialisation du tableau des antennes
    document
      .getElementById("antennasTable")
      .getElementsByTagName("tbody")[0].innerHTML = ""
    showResults()

    // Traitement pour chaque opérateur
    operators.forEach((op) => {
      displayOperatorName(op, region, latitude, longitude, radius) // Affichage du nom de l'opérateur
      getTotalAntennasCount(op, latitude, longitude, radius) // Récupération du nombre d'antennes
    })
  })

// Fonction pour déterminer les opérateurs en fonction de la région
function determineOperators(region) {
  // Retourne les opérateurs selon la région choisie
  if (region === "metropole") {
    return ["ORANGE", "BOUYGUES%20TELECOM", "SFR", "FREE%20MOBILE"]
  } else {
    return ["ORANGE", "FREE%20CARAIBES", "DIGICEL", "OUTREMER%20TELECOM"]
  }
}

// Fonction appelée lorsque la géolocalisation réussit
function showPosition(position) {
  document.getElementById("latitude").value =
    position.coords.latitude.toFixed(6)
  document.getElementById("longitude").value =
    position.coords.longitude.toFixed(6)
}

// Fonction pour ouvrir la carte dans un nouvel onglet
function openMapInNewTab(operator, latitude, longitude, radius, region) {
  const mapUrl = buildMapUrl(
    operator,
    latitude,
    longitude,
    radius,
    region
  )
  window.open(mapUrl, "_blank")
}

// Fonction pour obtenir le nom affiché de l'opérateur
function getOperatorDisplayName(operator, region) {
  // Traite les noms d'opérateurs pour l'affichage selon la région
  if (region === "antilles") {
    if (operator === "ORANGE") {
      return "ORANGE CARAIBES"
    } else if (operator === "OUTREMER%20TELECOM") {
      return "SFR CARAIBES"
    }
  }
  return operator.replace("%20", " ")
}

// Fonction pour obtenir le nom de l'opérateur formaté pour l'utilisation dans l'API
function getOperatorApiName(operator) {
  // Remplace les espaces par %20 pour une utilisation correcte dans les URL
  return operator.replace(" ", "%20")
}

// Fonction pour compter les pylônes uniques pour un opérateur donné
async function countPylonsForOperator(
  operator,
  latitude,
  longitude,
  radius,
  region
) {
  try {
    // Correspondance des noms d'opérateurs pour la région Antilles-Guyane
    if (region === "antilles") {
      if (operator === "SFR CARAIBES") {
        operator = "OUTREMER%20TELECOM" // Remplacer SFR CARAIBES par OUTREMER TELECOM
      } else if (operator === "ORANGE CARAIBES") {
        operator = "ORANGE" // Remplacer ORANGE CARAIBES par ORANGE
      }
    }

    // Formater correctement le nom de l'opérateur pour une URL
    operator = operator.replace(" ", "%20")

    const baseUrl = "https://data.anfr.fr/d4c/api/records/1.0/search/"
    const query = `facet=sup_id&rows=1000&dataset=observatoire_2g_3g_4g&refine.adm_lb_nom=${operator}&refine.statut=En%20service&refine.statut=Techniquement%20op%C3%A9rationnel&lang=fr&geofilter.distance=${latitude},${longitude},${radius}`
    const response = await fetch(baseUrl + query)
    const data = await response.json()

    const uniquePylons = new Set()
    data.records.forEach((record) => {
      if (record.fields.sup_id) {
        uniquePylons.add(record.fields.sup_id)
      }
    })

    return uniquePylons.size
  } catch (error) {
    console.error(
      "Erreur lors de la requête à l'API pour l'opérateur " + operator,
      error
    )
    return 0
  }
}

// Fonction pour calculer et afficher le nombre total de pylônes uniques pour tous les opérateurs
async function calculateAndDisplayTotalPylons(
  latitude,
  longitude,
  radius
) {
  const baseUrl = "https://data.anfr.fr/d4c/api/records/1.0/search/"
  const query = `facet=sup_id&rows=1000&dataset=observatoire_2g_3g_4g&refine.statut=En%20service&refine.statut=Techniquement%20op%C3%A9rationnel&lang=fr&geofilter.distance=${latitude},${longitude},${radius}`

  try {
    const response = await fetch(baseUrl + query, { mode: "cors" })
    if (!response.ok) throw new Error("Network response was not ok")
    const data = await response.json()

    const uniquePylons = new Set(
      data.records.map((record) => record.fields.sup_id)
    )

    document.getElementById(
      "totalPylons"
    ).textContent = `Nombre total de pylônes uniques : ${uniquePylons.size}`
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données de l'ANFR",
      error
    )
    document.getElementById("totalPylons").innerHTML = handleError(error)
  }
}

// Fonction pour obtenir le nombre d'antennes par génération
function getAntennasCountByGeneration(
  operator,
  latitude,
  longitude,
  radius,
  generation,
  callback
) {
  const url = `https://data.anfr.fr/d4c/api/records/1.0/search/rows=1000&dataset=observatoire_2g_3g_4g&refine.adm_lb_nom=${operator}&refine.generation=${generation}&refine.statut=En%20service&refine.statut=Techniquement%20op%C3%A9rationnel&lang=fr&geofilter.distance=${latitude},${longitude},${radius}`

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(`Résultats pour ${generation}:`, data.records.length)
      callback(generation, data.records.length)
    })
    .catch((error) =>
      console.error("Erreur lors de la récupération des données:", error)
    )
}

// Fonction pour obtenir le total des antennes par opérateur
function getTotalAntennasCount(operator, latitude, longitude, radius) {
  const generations = ["2G", "3G", "4G", "5G"]
  const results = {}

  generations.forEach((generation) => {
    getAntennasCountByGeneration(
      operator,
      latitude,
      longitude,
      radius,
      generation,
      (gen, count) => {
        results[gen] = count

        // Vérifier si toutes les générations ont été traitées
        if (Object.keys(results).length === generations.length) {
          displayAntennasCount(operator, results)
        }
      }
    )
  })
}