import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Parametres from "../pages/Parametres";
import { fetchWithToken } from "../utils/fetchWithToken";

jest.mock("../components/Layout/Layout", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="mock-layout">{children}</div>,
}));

jest.mock("../contexts/ToastContext", () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock("../utils/fetchWithToken", () => ({
  fetchWithToken: jest.fn(),
}));

describe("Parametres page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders hourly rate and extra days rate, but NOT fixed entry price", async () => {
    fetchWithToken.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        tarif_horaire: 1200,
        tarif_jours_supp: 2500,
      }),
    });

    render(<Parametres />);

    // Attendre le chargement des données
    await waitFor(() => {
      expect(screen.getByDisplayValue("1200")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2500")).toBeInTheDocument();
    });

    // Vérifier les libellés présents
    expect(screen.getByText(/tarif horaire/i)).toBeInTheDocument();
    expect(screen.getByText(/tarif jours supplémentaires/i)).toBeInTheDocument();

    // VÉRIFICATION CRITIQUE : Le prix fixe d'entrée ne doit plus exister nulle part
    expect(screen.queryByText(/prix fixe d'entrée/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/forfait appliqué dès l'entrée/i)).not.toBeInTheDocument();
  });
});
