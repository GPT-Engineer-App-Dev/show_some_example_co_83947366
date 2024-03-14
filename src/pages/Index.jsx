import React, { useState, useEffect } from "react";
import { Box, FormControl, FormLabel, Input, Button, Text, useToast, Image } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [hexCode, setHexCode] = useState("");
  const [colorName, setColorName] = useState("");
  const [exampleColors, setExampleColors] = useState([]);
  const [colorSwatch, setColorSwatch] = useState(null);
  const toast = useToast();

  const fetchColorName = async (hex) => {
    try {
      const response = await fetch(`https://api.color.pizza/v1/${hex}`);
      if (!response.ok) {
        throw new Error("Color not found");
      }
      const data = await response.json();
      if (data.colors && data.colors.length > 0) {
        setColorName(data.colors[0].name);
        setColorSwatch(data.colors[0].swatchImg.svg);
      } else {
        setColorName("Color name not found");
        setColorSwatch(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchExampleColors = async () => {
      const response = await fetch("https://api.color.pizza/v1/?values=264653,2a9d8f,e9c46a,f4a261,e76f51");
      const data = await response.json();
      setExampleColors(data.colors);
    };

    fetchExampleColors();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchColorName(hexCode.replace("#", ""));
  };

  return (
    <Box p={4}>
      <FormControl id="hex-color" as="form" onSubmit={handleSubmit}>
        <FormLabel>Enter HEX Color Code</FormLabel>
        <Input type="text" placeholder="e.g., #1a2b3c" value={hexCode} onChange={(e) => setHexCode(e.target.value)} />
        <Button leftIcon={<FaSearch />} mt={2} colorScheme="blue" type="submit">
          Translate Color
        </Button>
      </FormControl>
      {colorName && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Color Name: {colorName}
          </Text>
          {colorSwatch && <Box mt={2} dangerouslySetInnerHTML={{ __html: colorSwatch }} />}
        </Box>
      )}
      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold">
          Example Colors:
        </Text>
        <Box mt={4} display="flex" flexWrap="wrap">
          {exampleColors.map((color) => (
            <Box key={color.hex} mr={4} mb={4}>
              <Box dangerouslySetInnerHTML={{ __html: color.swatchImg.svg }} />
              <Text mt={1}>{color.name}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Index;
