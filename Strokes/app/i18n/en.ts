const en = {
  Genders: {
    gender: [
      { key: "male", text: "Male" },
      { key: "female", text: "Female" },
    ],
  },
  neighborhoods: {
    cities: [
      { label: "Amherst", value: "amherst" },
      { label: "Attleboro", value: "attleboro" },
      { label: "Auburn", value: "auburn" },
      { label: "Babson Park", value: "babson park" },
      { label: "Belmont", value: "belmont" },
      { label: "Beverly", value: "beverly" },
      { label: "Boston", value: "boston" },
      { label: "Charlestown", value: "charlestown" },
      { label: "Concord", value: "concord" },
      { label: "Deerfield", value: "deerfield" },
      { label: "Brookline", value: "brookline" },
      { label: "Cambridge", value: "cambridge" },
      { label: "Cohasset", value: "cohasset" },
      { label: "Dover", value: "dover" },
      { label: "Natick", value: "natick" },
      { label: "Wellesley", value: "wellesley" },
      { label: "Dedham", value: "dedham" },
      { label: "North Andover", value: "north andover" },
      { label: "Sudbury", value: "sudbury" },
      { label: "Newton Center", value: "newton center" },
      { label: "Milton", value: "milton" },
      { label: "Lexington", value: "lexington" },
      { label: "South Hadley", value: "south hadley" },
      { label: "West Newton", value: "west newton" },
      { label: "Groton", value: "groton" },
      { label: "Allston", value: "allston" },
      { label: "Haverhill", value: "haverhill" },
      { label: "Holyoke", value: "holyoke" },
      { label: "Gloucester", value: "gloucester" },
      { label: "Worcester", value: "worcester" },
      { label: "Marblehead", value: "marblehead" },
      { label: "North Adams", value: "north adams" },
      { label: "South Hamilton", value: "south hamilton" },
      { label: "Nantucket", value: "nantucket" },
      { label: "Newton", value: "newton" },
      { label: "Needham", value: "needham" },
      { label: "Great Barrington", value: "great barrington" },
      { label: "Northampton", value: "northampton" },
      { label: "Springfield", value: "springfield" },
      { label: "Ipswich", value: "ipswich" },
      { label: "Weston", value: "weston" },
      { label: "Williamstown", value: "williamstown" },
      { label: "Easthampton", value: "easthampton" },
      { label: "Waltham", value: "waltham" },
      { label: "Newton Centre", value: "newton centre" },
      { label: "Eastham", value: "eastham" },
      { label: "New Bedford", value: "new bedford" },
      { label: "Lowell", value: "lowell" },
      { label: "Dorchester", value: "dorchester" },
      { label: "Westfield", value: "westfield" },
    ],
  },
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  genderField: {
    genderFemaleFieldLabel: "Female",
    genderMaleFieldLabel: "Male",
  },
  loginScreen: {
    signIn: "Sign In",
    enterDetails:
      "Enter your details below to unlock top secret info. You'll never guess what we've got waiting. Or maybe you will; it's not rocket science here.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToSignIn: "Tap to sign in!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  Hello: {
    title:"Hello",
    enterDetails: "Welcome to Strokes. Do you want to sign in or sign up?",
    signIn: "Sign In",
    signUp: "Sign Up",
  },
  VerificationSignUpScreen: {
    enterDetails: "We sent you a secret code on your phone, it will help us know you're real!",
    verificationCode: "Secret Code",
    tapToVerify: "Verify",
    title:"Verify Code"
  },
  signUpScreen: {
    signIn: "Sign Up",
    enterDetails:
      "Swipe, match, and rally! Dive into the squash scene with our app for finding friends to the hit the court with.",
    //gender input
    genderFieldLabel: "Gender",
    //squash level
    neighborhoodFieldLabel: "Neighborhood",
    descriptionFieldLabel: "Share your squash story!",
    firstNameFieldLabel: "First Name",
    lastNameFieldLabel: "Last Name",
    phoneFieldLabel: "Phone",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    genderFemaleFieldLabel: "Female",
    genderMaleFieldLabel: "Male",
    tapToSignIn: "Tap to sign up!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Yay",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "Congratulations, you've got a very advanced React Native app template here.  Take advantage of this boilerplate!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },
}
export default en
export type Translations = typeof en
