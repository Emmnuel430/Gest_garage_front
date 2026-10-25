import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OutilForm from "../components/outils/OutilForm";

describe("OutilForm component", () => {
  const defaultProps = {
    selected: null,
    libelle: "Compresseur",
    reference: "COMP-01",
    quantite: 5,
    estSpecial: false,
    prixParHeure: 0,
    setLibelle: jest.fn(),
    setReference: jest.fn(),
    setQuantite: jest.fn(),
    setEstSpecial: jest.fn(),
    setPrixParHeure: jest.fn(),
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    loading: false,
  };

  test("renders standard fields and special tool switch", () => {
    render(<OutilForm {...defaultProps} />);

    expect(screen.getByDisplayValue("Compresseur")).toBeInTheDocument();
    expect(screen.getByDisplayValue("COMP-01")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: /outil spécial/i })).toBeInTheDocument();

    // Le champ tarif horaire de l'outil ne doit pas être visible si estSpecial est faux
    expect(screen.queryByPlaceholderText(/ex\. 2500/i)).not.toBeInTheDocument();
  });

  test("displays hourly rate field when estSpecial is true", () => {
    render(
      <OutilForm
        {...defaultProps}
        estSpecial={true}
        prixParHeure={2500}
      />
    );

    const switchEl = screen.getByRole("switch", { name: /outil spécial/i });
    expect(switchEl).toBeChecked();

    const priceInput = screen.getByPlaceholderText(/ex\. 2500/i);
    expect(priceInput).toBeInTheDocument();
    expect(priceInput).toHaveValue(2500);
  });

  test("toggles estSpecial switch when clicked", () => {
    const setEstSpecialMock = jest.fn();
    render(
      <OutilForm
        {...defaultProps}
        estSpecial={false}
        setEstSpecial={setEstSpecialMock}
      />
    );

    const switchEl = screen.getByRole("switch", { name: /outil spécial/i });
    fireEvent.click(switchEl);
    expect(setEstSpecialMock).toHaveBeenCalledWith(true);
  });

  test("disables submit button when special tool has zero or invalid price", () => {
    render(
      <OutilForm
        {...defaultProps}
        estSpecial={true}
        prixParHeure={0}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /ajouter l'outil/i });
    expect(submitBtn).toBeDisabled();
  });
});
