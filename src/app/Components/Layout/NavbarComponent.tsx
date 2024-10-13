"use client";

import { auth } from "@/app/Config/firebase";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPatchQuestion } from "react-icons/bs";

export default function NavbarComponent() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["About", "Contact", "Developer"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/">
            <BsPatchQuestion className="w-7 h-7 mr-1" />
            <p className="font-bold text-inherit">Anonyl</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="about">
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="developer" aria-current="page">
            Developer
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="mailto:thexenostudios@gmail.com">
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.toLowerCase()}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      {user ? (
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={user.displayName?.toString()}
                size="sm"
                src={user.photoURL?.toString()}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="inbox" href="/chats">
                Chats Inbox
              </DropdownItem>
              <DropdownItem key="sent" href="/Send">
                Sent Messages
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => {
                  signOut(auth).then(() => router.push("/"));
                }}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/register" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
