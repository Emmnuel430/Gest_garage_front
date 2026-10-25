import React from "react";
import { render, screen } from "@testing-library/react";
import OutilsTable from "../components/outils/OutilsTable";

describe("OutilsTable component", () => {
  const outils = [
    {
      id: 1,
      libelle: "Tournevis cruciforme",
      reference: "TOURN-01",
      quantite: 10,
      est_special: false,
      prix_par_heure: 0,
    },
    {
      id: 2,
      libelle: "Pont élévateur 4T",
      reference: "PONT-02",
      quantite: 1,
      est_special: true,
      prix_par_heure: 3500,
    },
  ];

  test("renders tools list and identifies special tools with badge", () => {
    render(
      <OutilsTable
        outils={outils}
        selectedId={null}
        currentPage={1}
        totalPages={1}
        onPageChange={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Outil standard
    expect(screen.getByText("Tournevis cruciforme")).toBeInTheDocument();
    expect(screen.getByText("TOURN-01")).toBeInTheDocument();

    // Outil spécial
    expect(screen.getByText("Pont élévateur 4T")).toBeInTheDocument();
    expect(screen.getByText("PONT-02")).toBeInTheDocument();

    // Badge spécial avec tarif horaire
    expect(screen.getByText(/spécial : 3 500 fcfa\/h/i)).toBeInTheDocument();
  });
});
