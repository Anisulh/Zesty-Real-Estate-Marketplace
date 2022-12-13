import styled from "@mui/material/styles/styled";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { StyledLinearProgressProps } from "./types";


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
      backgroundColor: 'red',
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
      backgroundColor: 'orange',
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
      backgroundColor: 'blue',
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
      backgroundColor: 'green',
    },
  }),
}));