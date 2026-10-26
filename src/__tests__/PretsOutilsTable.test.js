import React from "react";
import { render, screen } from "@testing-library/react";
import PretsOutilsTable from "../components/outils/PretsOutilsTable";

describe("PretsOutilsTable component", () => {
  const prets = [
    {
      id: 1,
      quantite: 1,
      statut: "prete",
      est_partage: false,
      outil: {
        libelle: "Clé dynamométrique",
        reference: "CLE-DYN-01",
        est_special: false,
      },
      mecanicien: {
        nom: "Traoré",
        prenom: "Amadou",
        type: "Général",
      },
      reparation: {
        reception: {
          vehicule: {
            immatriculation: "AB-123-CD",
            marque: "Peugeot",
            modele: "208",
          },
        },
      },
    },
    {
      id: 2,
      quantite: 1,
      statut: "prete",
      est_partage: true,
      outil: {
        libelle: "Valise Diagnostic Pro Max Extended Edition",
        reference: "VAL-DIAG-99",
        est_special: true,
        prix_par_heure: 2500,
      },
      mecanicien: {
        nom: "Kone",
        prenom: "Ibrahim",
        type: "Électricien",
      },
      reparation: {
        reception: {
          vehicule: {
            immatriculation: "EF-456-GH",
            marque: "Mercedes",
            modele: "C200",
          },
        },
      },
    },
  ];

  test("renders loan list, handles long tool names, special tool badges, and shared status", () => {
    render(
      <PretsOutilsTable
        prets={prets}
        currentPage={1}
        totalPages={1}
        onPageChange={jest.fn()}
        onEditPret={jest.fn()}
        onRestituerPret={jest.fn()}
      />
    );

    // Standard loan
    expect(screen.getByText("Clé dynamométrique")).toBeInTheDocument();
    expect(screen.getByText("CLE-DYN-01")).toBeInTheDocument();
    expect(screen.getByText("AB-123-CD")).toBeInTheDocument();

    // Special tool loan
    expect(
      screen.getByText("Valise Diagnostic Pro Max Extended Edition")
    ).toBeInTheDocument();
    expect(screen.getByText("VAL-DIAG-99")).toBeInTheDocument();
    expect(screen.getByText(/Spécial : 2 500 FCFA\/h/i)).toBeInTheDocument();

    // Shared status
    expect(screen.getByText(/Partagé/i)).toBeInTheDocument();

    // Buttons
    expect(screen.getAllByRole("button", { name: /Gérer/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /Restituer/i })).toHaveLength(2);
  });
});
