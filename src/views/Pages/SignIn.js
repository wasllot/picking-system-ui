import React, { useState } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/login-image.jpg";

import { useAuth } from "../../auth-context/auth.context";
import AuthApi from "../../api/auth";

import { useHistory } from "react-router-dom";

function SignIn() {
  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");
  const history = useHistory();
  const { setUser } = useAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [buttonText, setButtonText] = useState("Ingresar");

  const login = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (user && user.token) {
      return history.push("/dashboard");
    }
    if (email === "") {
      return setError("Debe ingresar su correo.");
    }
    if (password === "") {
      return setError("Debe ingresar su contraseña.");
    }
    setButtonText("Ingresando");
    try {
      let response = await AuthApi.Login({
        email,
        password,
      });
      if (response.data && response.data.success === false) {
        setButtonText("Ingresar");
        return setError(response.data.msg);
      }
      return setProfile(response);
    } catch (err) {
      console.log(err);
      setButtonText("Ingresar");
      if (err.response) {
        return setError(err.response.data.msg);
      }
      return setError("Ha ocurrido un error.");
    }
  };

  const setProfile = async (response) => {
    let user = { ...response.data.user };
    user.token = response.data.token;
    user = JSON.stringify(user);
    setUser(user);
    localStorage.setItem("user", user);
    return history.push("/dashboard");
  };

  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          {user && user.token ?
            <div>
              <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
                Welcome Back
            </Heading>
              <h3 style={{ textAlign: "center" }}>You are already signed in.</h3>
              <Button
                fontSize="15px"
                type="submit"
                bg="teal.300"
                w="100%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
                onClick={login}>
                {`Let's go`}
              </Button>
            </div>
            :
            <Flex
              direction="column"
              w="100%"
              background="transparent"
              p="48px"
              mt={{ md: "150px", lg: "80px" }}
            >
              <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
               Picking System
            </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Sistema de picking para DLDS
            </Text>
              <FormControl>
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Correo
              </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="24px"
                  fontSize="sm"
                  type="text"
                  placeholder="Su correo electrónico"
                  size="lg"
                  defaultValue={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(undefined);
                  }}
                />
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Contraseña
              </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="36px"
                  fontSize="sm"
                  type="password"
                  placeholder="Su contraseña"
                  size="lg"
                  defaultValue={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(undefined);
                  }}
                />
                <FormControl display="flex" alignItems="center">
                  <Switch id="remember-login" colorScheme="teal" me="10px" />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="1"
                    ms="1"
                    fontWeight="normal"
                  >
                    Recordarme
                </FormLabel>
                </FormControl>
                <h4
                  style={{
                    fontSize: ".9em",
                    color: "red",
                    textAlign: "center",
                    fontWeight: 400,
                    transition: ".2s all",
                  }}
                >
                  {error}
                </h4>
                <Button
                  fontSize="10px"
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                  onClick={login}
                >
                  {buttonText}
                </Button>
              </FormControl>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxW="100%"
                mt="0px"
              >
              </Flex>
            </Flex>
          }
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="40vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
