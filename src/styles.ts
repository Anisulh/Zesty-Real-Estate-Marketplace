import styled from "@mui/material/styles/styled";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { StyledLinearProgressProps } from "./types";
import { createTheme } from "@mui/material";
import herobg from "./assets/images/herobg.jpg";

export const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "progress",
})<StyledLinearProgressProps>(({ progress, theme }) => ({
  ...(progress === 30 && {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "red",
    },
  }),
  ...(progress === 50 && {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "orange",
    },
  }),
  ...(progress === 80 && {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "blue",
    },
  }),
  ...(progress === 100 && {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: "green",
    },
  }),
}));

export const heroBG = createTheme({
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: `url(${herobg})`,
          height: "600px",
          backgroundPosition: "top left",
          backgroundRepeat: "no-repeat",
          backgroundSize: "150%",
        },
      },
    },
  },
});

export const inputStyleOverride = createTheme({
  components: {
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(232, 241, 250)",
          "&:hover": {
            backgroundColor: "rgb(250, 232, 241)",
            "@media (hover: none)": {
              backgroundColor: "rgb(232, 241, 250)",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "rgb(250, 241, 232)",
          },
        },
      },
    },
  },
});
