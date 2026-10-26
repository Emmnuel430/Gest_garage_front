import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NotificationBell from "../components/Layout/NotificationBell";
import { useNotifications } from "../contexts/NotificationContext";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../contexts/NotificationContext", () => ({
  useNotifications: jest.fn(),
}));

describe("NotificationBell UI/UX and dark/light contrast", () => {
  const markAsReadMock = jest.fn();
  const markAllAsReadMock = jest.fn();

  const sampleNotifications = [
    {
      id: "notif-1",
      title: "Stock Critique",
      message: "L'outil Valise Diagnostic est presque epuise.",
      type: "danger",
      read: false,
      created_at: "Il y a 5 min",
      action_url: "/outils/caisse",
    },
    {
      id: "notif-2",
      title: "Prise en charge",
      message: "Vehicule AB-123-CD valide en reparation.",
      type: "success",
      read: true,
      created_at: "Il y a 20 min",
      action_url: "/reparations/1",
    },
    {
      id: "notif-3",
      title: "Alerte Chrono",
      message: "Reparation en pause depuis 45 minutes.",
      type: "warning",
      read: false,
      created_at: "Il y a 2 min",
      action_url: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useNotifications.mockReturnValue({
      notifications: sampleNotifications,
      unreadCount: 2,
      markAsRead: markAsReadMock,
      markAllAsRead: markAllAsReadMock,
    });
  });

  test("renders notification bell with unread badge count", () => {
    render(<NotificationBell />);
    const bellBtn = screen.getByRole("button", { name: /Centre de notifications/i });
    expect(bellBtn).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("opens offcanvas and displays tab filters with semantic contrast classes", () => {
    render(<NotificationBell />);
    const bellBtn = screen.getByRole("button", { name: /Centre de notifications/i });
    fireEvent.click(bellBtn);

    // Entete et onglets
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("Toutes (3)")).toBeInTheDocument();
    expect(screen.getByText("Non lues (2)")).toBeInTheDocument();
    expect(screen.getByText("Tout lire")).toBeInTheDocument();

    // Verification des badges semantiques Bootstrap 5.3 a contraste eleve
    const stockBadge = screen.getByText("Stock Critique").closest(".badge");
    expect(stockBadge).toHaveClass("bg-danger-subtle");
    expect(stockBadge).toHaveClass("text-danger-emphasis");

    const successBadge = screen.getByText("Prise en charge").closest(".badge");
    expect(successBadge).toHaveClass("bg-success-subtle");
    expect(successBadge).toHaveClass("text-success-emphasis");

    const warningBadge = screen.getByText("Alerte Chrono").closest(".badge");
    expect(warningBadge).toHaveClass("bg-warning-subtle");
    expect(warningBadge).toHaveClass("text-warning-emphasis");
  });

  test("filters to unread notifications when Non lues tab is clicked", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Centre de notifications/i }));

    const unreadTabBtn = screen.getByRole("button", { name: /Non lues \(2\)/i });
    fireEvent.click(unreadTabBtn);

    // Les non lues sont affichees
    expect(screen.getByText("Stock Critique")).toBeInTheDocument();
    expect(screen.getByText("Alerte Chrono")).toBeInTheDocument();

    // La notification lue est masquee
    expect(screen.queryByText("Prise en charge")).not.toBeInTheDocument();
  });

  test("triggers markAllAsRead when clicking Tout lire", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Centre de notifications/i }));

    const markAllBtn = screen.getByRole("button", { name: /Tout lire/i });
    fireEvent.click(markAllBtn);

    expect(markAllAsReadMock).toHaveBeenCalledTimes(1);
  });

  test("triggers markAsRead and navigation when clicking a notification card", () => {
    render(<NotificationBell />);
    fireEvent.click(screen.getByRole("button", { name: /Centre de notifications/i }));

    const unreadCard = screen.getByText("Stock Critique").closest('[role="button"]');
    fireEvent.click(unreadCard);

    expect(markAsReadMock).toHaveBeenCalledWith("notif-1");
    expect(mockNavigate).toHaveBeenCalledWith("/outils/caisse");
  });
});
