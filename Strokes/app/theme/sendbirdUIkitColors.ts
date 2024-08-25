import {UIKitTheme} from "@sendbird/uikit-react-native-foundation"
import {palette} from "./colors"

export const customTheme: UIKitTheme = {
  colorScheme: "light",
  select: (options) => options.light || options.default,
  palette: {
    primary100: "#E1FFC7",
    primary200: "#ffffff",
    primary300: "#ededed",
    primary400: "#222222",
    primary500: "#007AFF",
    secondary100: "#aaaaaa",
    secondary200: "#666666",
    secondary300: "#333333",
    secondary400: "#000000",
    secondary500: "#000000",
    error100: "#ff3b30",
    error200: "#ff3b30",
    error300: "#ff3b30",
    error400: "#ff3b30",
    error500: "#ff3b30",
    background50: palette.neutral100,
    background100: palette.neutral200,
    background200: palette.neutral300,
    background300: palette.neutral400,
    background400: palette.neutral500,
    background500: palette.neutral600,
    background600: palette.neutral700,
    background700: palette.neutral800,
    overlay01: "rgba(0,0,0,0.1)",
    overlay02: "rgba(0,0,0,0.2)",
    information: "#2196F3",
    highlight: "#FFEB3B",
    transparent: "transparent",
    onBackgroundLight01: palette.neutral900,
    onBackgroundLight02: palette.neutral800,
    onBackgroundLight03: palette.neutral700,
    onBackgroundLight04: palette.neutral600,
    onBackgroundDark01: palette.neutral100,
    onBackgroundDark02: palette.neutral200,
    onBackgroundDark03: palette.neutral300,
    onBackgroundDark04: palette.neutral400,
  },
  colors: {
    primary: palette.neutral500,
    secondary: palette.neutral600,
    error: "#FF0000",
    background: palette.neutral100,
    text: palette.neutral100,
    onBackground01: palette.neutral800,
    onBackground02: palette.neutral700,
    onBackground03: palette.neutral600,
    onBackground04: palette.neutral500,
    onBackgroundReverse01: palette.neutral100,
    onBackgroundReverse02: palette.neutral200,
    onBackgroundReverse03: palette.neutral300,
    onBackgroundReverse04: palette.neutral400,
    ui: {
      header: {
        nav: {
          none: {
            background: palette.neutral100,
            borderBottom: palette.neutral300,
          },
        },
      },
      button: {
        contained: {
          enabled: {
            background: palette.neutral500,
            content: palette.neutral100,
          },
          pressed: {
            background: palette.neutral600,
            content: palette.neutral100,
          },
          disabled: {
            background: palette.neutral400,
            content: palette.neutral100,
          },
        },
        text: {
          enabled: {
            background: "transparent",
            content: palette.neutral500,
          },
          pressed: {
            background: "transparent",
            content: palette.neutral600,
          },
          disabled: {
            background: "transparent",
            content: palette.neutral400,
          },
        },
      },
      dialog: {
        default: {
          none: {
            background: palette.neutral100,
            text: palette.neutral900,
            message: palette.neutral800,
            highlight: palette.neutral500,
            destructive: "#FF0000",
            blurred: palette.neutral200,
          },
        },
      },
      input: {
        default: {
          active: {
            text: palette.neutral900,
            placeholder: palette.neutral700,
            background: palette.neutral100,
            highlight: palette.neutral500,
          },
          disabled: {
            text: palette.neutral600,
            placeholder: palette.neutral700,
            background: palette.neutral200,
            highlight: palette.neutral400,
          },
        },
        underline: {
          active: {
            text: palette.neutral900,
            placeholder: palette.neutral700,
            background: "transparent",
            highlight: palette.neutral500,
          },
          disabled: {
            text: palette.neutral600,
            placeholder: palette.neutral700,
            background: "transparent",
            highlight: palette.neutral400,
          },
        },
      },
      badge: {
        default: {
          none: {
            text: palette.neutral100,
            background: palette.neutral500,
          },
        },
      },
      placeholder: {
        default: {
          none: {
            content: palette.neutral600,
            highlight: palette.neutral500,
          },
        },
      },
      dateSeparator: {
        default: {
          none: {
            text: palette.neutral900,
            background: palette.neutral200,
          },
        },
      },
      groupChannelMessage: {
        incoming: {
          enabled: {
            textMsg: palette.neutral900,
            textEdited: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textVoicePlaytime: palette.neutral900,
            background: palette.neutral300,
            voiceSpinner: palette.neutral400,
            voiceProgressTrack: palette.neutral300,
            voiceActionIcon: palette.neutral900,
            voiceActionIconBackground: palette.neutral100,
          },
          pressed: {
            textMsg: palette.neutral900,
            textEdited: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textVoicePlaytime: palette.neutral900,
            background: palette.neutral800,
            voiceSpinner: palette.neutral300,
            voiceProgressTrack: palette.neutral300,
            voiceActionIcon: palette.neutral900,
            voiceActionIconBackground: palette.neutral100,
          },
        },
        outgoing: {
          enabled: {
            textMsg: palette.neutral100,
            textEdited: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textVoicePlaytime: palette.neutral900,
            background: palette.primary500,
            voiceSpinner: palette.neutral500,
            voiceProgressTrack: palette.neutral500,
            voiceActionIcon: palette.neutral900,
            voiceActionIconBackground: palette.neutral100,
          },
          pressed: {
            textMsg: palette.neutral900,
            textEdited: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textVoicePlaytime: palette.neutral900,
            background: palette.neutral500,
            voiceSpinner: palette.neutral500,
            voiceProgressTrack: palette.neutral500,
            voiceActionIcon: palette.neutral900,
            voiceActionIconBackground: palette.neutral100,
          },
        },
      },
      groupChannelPreview: {
        default: {
          none: {
            textTitle: palette.neutral900,
            textTitleCaption: palette.neutral800,
            textBody: palette.neutral900,
            memberCount: palette.neutral700,
            bodyIcon: palette.neutral900,
            background: palette.neutral100,
            coverBackground: palette.neutral200,
            bodyIconBackground: palette.neutral300,
            separator: palette.neutral400,
          },
        },
      },
      profileCard: {
        default: {
          none: {
            textUsername: palette.neutral900,
            textBodyLabel: palette.neutral800,
            textBody: palette.neutral900,
            background: palette.neutral100,
          },
        },
      },
      reaction: {
        default: {
          enabled: {
            background: palette.neutral200,
            highlight: palette.neutral500,
          },
          selected: {
            background: palette.neutral500,
            highlight: palette.neutral200,
          },
        },
        rounded: {
          enabled: {
            background: palette.neutral200,
            highlight: palette.neutral500,
          },
          selected: {
            background: palette.neutral500,
            highlight: palette.neutral200,
          },
        },
      },
      openChannelMessage: {
        default: {
          enabled: {
            textMsg: palette.neutral900,
            textMsgPostfix: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textOperator: palette.neutral900,
            background: palette.neutral100,
            bubbleBackground: palette.neutral200,
            adminBackground: palette.neutral300,
          },
          pressed: {
            textMsg: palette.neutral900,
            textMsgPostfix: palette.neutral700,
            textSenderName: palette.neutral900,
            textTime: palette.neutral800,
            textOperator: palette.neutral900,
            background: palette.neutral200,
            bubbleBackground: palette.neutral300,
            adminBackground: palette.neutral400,
          },
        },
      },
      openChannelPreview: {
        default: {
          none: {
            textTitle: palette.neutral900,
            textParticipants: palette.neutral800,
            frozenIcon: palette.neutral900,
            participantsIcon: palette.neutral700,
            background: palette.neutral100,
            coverBackground: palette.neutral200,
            separator: palette.neutral300,
          },
        },
      },
      voiceMessageInput: {
        default: {
          active: {
            textCancel: "#FF0000",
            textTime: palette.neutral900,
            background: palette.neutral100,
            actionIcon: palette.neutral900,
            actionIconBackground: palette.neutral300,
            sendIcon: palette.neutral900,
            sendIconBackground: palette.neutral500,
            progressTrack: palette.neutral500,
            recording: "#FF0000",
          },
          inactive: {
            textCancel: palette.neutral700,
            textTime: palette.neutral800,
            background: palette.neutral200,
            actionIcon: palette.neutral700,
            actionIconBackground: palette.neutral300,
            sendIcon: palette.neutral700,
            sendIconBackground: palette.neutral400,
            progressTrack: palette.neutral400,
            recording: "#FF6666",
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontFamily: "spaceGroteskBold",
      fontSize: 36,
      lineHeight: 30,
      letterSpacing: 0,
      fontWeight: "bold",
    },
    h2: {
      fontFamily: "spaceGroteskSemiBold",
      fontSize: 22,
      lineHeight: 26,
      letterSpacing: 0,
      fontWeight: "bold",
    },
    subtitle1: {
      fontFamily: "spaceGroteskMedium",
      fontSize: 18,
      lineHeight: 22,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    subtitle2: {
      fontFamily: "spaceGroteskMedium",
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    body1: {
      fontFamily: "spaceGroteskRegular",
      fontSize: 18,
      lineHeight: 22,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    body2: {
      fontFamily: "spaceGroteskRegular",
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    body3: {
      fontFamily: "spaceGroteskRegular",
      fontSize: 17,
      lineHeight: 18,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    button: {
      fontFamily: "spaceGroteskMedium",
      fontSize: 16,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: "bold",
    },
    caption1: {
      fontFamily: "spaceGroteskLight",
      fontSize: 14,
      lineHeight: 18,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    caption2: {
      fontFamily: "spaceGroteskBold",
      fontSize: 17,
      lineHeight: 16,
      letterSpacing: 0,
      fontWeight: "bold",
    },
    caption3: {
      fontFamily: "spaceGroteskLight",
      fontSize: 10,
      lineHeight: 14,
      letterSpacing: 0,
      fontWeight: "normal",
    },
    caption4: {
      fontFamily: "spaceGroteskLight",
      fontSize: 8,
      lineHeight: 12,
      letterSpacing: 0,
      fontWeight: "normal",
    },
  },
}

