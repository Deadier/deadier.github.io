
# Cartographie des antennes mobiles

Ce projet est une application web pour visualiser les emplacements des antennes mobiles en France. L'utilisateur peut entrer des coordonnées géographiques, un rayon de recherche et sélectionner une région (Métropole ou Antilles-Guyane) pour afficher des informations sur les antennes mobiles dans la zone spécifiée.

## Fonctionnalités

-   **Recherche par coordonnées géographiques** : Permet aux utilisateurs d'entrer des coordonnées de latitude et de longitude pour cibler leur recherche.
-   **Sélection du rayon de recherche** : Les utilisateurs peuvent spécifier le rayon de recherche en mètres.
-   **Choix de la région** : Possibilité de choisir entre la Métropole et les Antilles-Guyane.
-   **Affichage dynamique des résultats** : Les résultats, y compris le nombre total d'antennes par opérateur et par génération de réseau (2G, 3G, 4G, 5G), sont affichés sous forme de tableau.
-   **Comptage des pylônes uniques** : La page affiche le nombre total de pylônes uniques pour chaque opérateur dans la zone de recherche spécifiée.
-   **Détails des antennes** : Un bouton "Détails" pour chaque opérateur ouvre une nouvelle page avec une carte montrant l'emplacement des antennes.
-   **Responsive design** : Le site est responsive et s'adapte aux différents appareils et tailles d'écran.

## Problème de CORS

Lors de l'accès aux données JSON fournies par l'ANFR, des problèmes de CORS (Cross-Origin Resource Sharing) peuvent survenir car les réponses de l'API ne sont pas en HTTPS. Pour contourner ce problème, il est recommandé d'utiliser une extension de navigateur qui permet de désactiver les restrictions CORS.

-   Pour Google Chrome, utilisez l'extension "CORS Unblock": [Chrome Web Store](https://chromewebstore.google.com/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
-   Pour Firefox, utilisez "CORS Unblock": [Firefox Add-ons](https://addons.mozilla.org/fr/firefox/addon/cors-unblock/) ou "Allow CORS: Access-Control-Allow-Origin": [Firefox Add-ons](https://addons.mozilla.org/fr/android/addon/access-control-allow-origin/)

-   Sur smartphone Android, le navigateur Firefox permet l'utilisation d'extensions, utilisez "Allow CORS: Access-Control-Allow-Origin": [Firefox Add-ons](https://addons.mozilla.org/fr/android/addon/access-control-allow-origin/)

## Technologies utilisées

-   HTML
-   CSS
-   JavaScript
-   API de l'ANFR pour les données des antennes mobiles

## Comment utiliser

1.  **Ouvrir la page web** : https://deadier.github.io/Cartographie%20des%20antennes%20mobiles.html
2.  **Entrer les coordonnées** : Remplissez les champs de latitude, longitude en degrés ou cliquer sur le bouton "Utiliser ma position actuelle" (nécessite l'autorisation d'utiliser la position dans le navigateur).
3.  **Entrer les coordonnées et le rayon** : Remplissez le rayon en mètres.
4.  **Sélectionner la région** : Choisissez entre la Métropole et les Antilles-Guyane, ce qui définira les opérateurs à rechercher.
5.  **Lancer la recherche** : Cliquez sur "Afficher les cartes" pour voir les résultats.
6.  **Consulter les détails** : Utilisez le bouton "Détails" pour ouvrir une nouvelle page avec la carte des antennes.
7.  **En cas de problèmes de CORS** : Installez l'extension "CORS Unblock" sur votre navigateur pour accéder correctement aux données.

## Licence

Ce projet est sous licence libre MIT.

## Remerciements

-   Données fournies par l'[ANFR](https://data.anfr.fr/accueil) (Agence Nationale des Fréquences).
-   Support technique et graphique fourni par [chatGPT](https://chat.openai.com/)
