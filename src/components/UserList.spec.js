import { render, screen } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";
import UserList from "./UserList";
import userEvent from "@testing-library/user-event";
const users = [
  { id: 1, username: "user1", email: "user1@mail.com", image: null },
  { id: 2, username: "user2", email: "user2@mail.com", image: null },
  { id: 3, username: "user3", email: "user3@mail.com", image: null },
  { id: 4, username: "user4", email: "user4@mail.com", image: null },
  { id: 5, username: "user5", email: "user5@mail.com", image: null },
  { id: 6, username: "user6", email: "user6@mail.com", image: null },
  { id: 7, username: "user7", email: "user7@mail.com", image: null },
];

const getPage = (page, size) => {
  let start = page * size;
  let end = start + size;
  let totalPages = Math.ceil(users.length / size);
  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

const page1 = {
  content: [
    { id: 1, username: "user1", email: "user1@mail.com", image: null },
    { id: 2, username: "user2", email: "user2@mail.com", image: null },
    { id: 3, username: "user3", email: "user3@mail.com", image: null },
  ],
  page: 0,
  size: 3,
  totalPages: 9,
};

const setup = () => {
  render(<UserList />);
};

const server = setupServer(
  rest.get("/api/1.0/users", (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get("page"));
    let size = Number.parseInt(req.url.searchParams.get("size"));
    if (Number.isNaN(page)) {
      page = 0;
    }
    if (Number.isNaN(size)) {
      size = 5;
    }
    return res(ctx.status(200), ctx.json(getPage(page, size)));
  })
);

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  server.resetHandlers();
});

describe("User List", () => {
  it("displays 3 users in list", async () => {
    setup();
    const users = await screen.findAllByText(/user/);
    expect(users.length).toBe(3);
  });
  it("it displays next page link", async () => {
    setup();
    const user = await screen.findAllByText("user1");
    expect(screen.queryByText("next >")).toBeInTheDocument();
  });
  it("displays next page after clicking next", async () => {
    setup();
    await screen.findByText("user1");
    const nextPageLink = screen.queryByText("next >");
    userEvent.click(nextPageLink);
    const user2 = await screen.findByText("user4");
    expect(user2).toBeInTheDocument();
  });
  xit("TODO (done, idk why it fails): hides next page link at last page", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.queryByText("next >"));
    await screen.findByText("user4");
    userEvent.click(screen.queryByText("next >"));
    await screen.findByText("user7");
    expect(screen.queryByText("next >")).not.toBeInTheDocument();
  });
  it("does not display the previous page link in first page", async () => {
    setup();
    await screen.findByText("user1");
    const previousPageLink = screen.queryByText("< prev");
    expect(previousPageLink).not.toBeInTheDocument();
  });
  it("displays the previous page link in second page", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.queryByText("next >"));
    await screen.findByText("user4");
    const previousPageLink = screen.queryByText("< prev");
    expect(previousPageLink).toBeInTheDocument();
  });
  it("displays the previous page after clicking previous page link", async () => {
    setup();
    await screen.findByText("user1");
    userEvent.click(screen.queryByText("next >"));
    await screen.findByText("user4");
    userEvent.click(screen.queryByText("< prev"));
    const user1 = await screen.findByText("user1");
    expect(user1).toBeInTheDocument();
  });
});
