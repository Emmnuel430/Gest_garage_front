import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditPretModal from "../components/outils/EditPretModal";

describe("EditPretModal component", () => {
  const mockPret = {
    id: 15,
    quantite: 2,
    quantite_pretee: 2,
    reparation_id: 101,
    mecanicien_id: 5,
    outil: {
      id: 3,
      libelle: "Scanner OBD2 Pro",
      reference: "OBD-PRO-03",
      quantite: 5,
      est_special: true,
      prix_par_heure: 2000,
    },
    mecanicien: {
      id: 5,
      nom: "Soro",
      prenom: "Koffi",
    },
    reparation: {
      id: 101,
      reception: {
        vehicule: {
          immatriculation: "AA-999-ZZ",
          marque: "Toyota",
          modele: "Yaris",
        },
      },
    },
  };

  const mockReparations = [
    {
      id: 101,
      statut: "en_cours",
      reception: {
        vehicule: {
          immatriculation: "AA-999-ZZ",
          mecanicien_id: 5,
          marque: "Toyota",
          modele: "Yaris",
        },
      },
    },
    {
      id: 102,
      statut: "en_cours",
      description: "Vidange et freins",
      reception: {
        motif_visite: "Freins",
        vehicule: {
          immatriculation: "BB-888-YY",
          mecanicien_id: 5,
          marque: "Peugeot",
          modele: "308",
        },
      },
    },
  ];

  test("renders loan details, quantity, and calls onSave with updated values", () => {
    const onSaveMock = jest.fn();
    const onCloseMock = jest.fn();

    render(
      <EditPretModal
        show={true}
        onClose={onCloseMock}
        onSave={onSaveMock}
        pret={mockPret}
        reparations={mockReparations}
      />
    );

    // Verify tool info
    expect(screen.getByText("Scanner OBD2 Pro")).toBeInTheDocument();
    expect(screen.getByText("OBD-PRO-03")).toBeInTheDocument();
    expect(screen.getByText(/Spécial : 2 000 FCFA\/h/i)).toBeInTheDocument();

    // Verify mechanic & initial vehicle
    expect(screen.getByText(/Koffi SORO/i)).toBeInTheDocument();
    expect(screen.getByText("AA-999-ZZ")).toBeInTheDocument();

    // Quantity input
    const quantiteInput = screen.getByLabelText(/Quantité prêtée/i);
    expect(quantiteInput).toHaveValue(2);

    fireEvent.change(quantiteInput, { target: { value: "3" } });
    expect(quantiteInput).toHaveValue(3);

    // Click save
    const saveButton = screen.getByRole("button", {
      name: /Enregistrer les modifications/i,
    });
    fireEvent.click(saveButton);

    expect(onSaveMock).toHaveBeenCalledWith(15, {
      quantite_pretee: 3,
    });
  });
});
