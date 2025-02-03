/**
 * Copyright 2024 Google LLC
 * Licensed under the Apache License, Version 2.0
 */
import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import { type Tool, SchemaType } from "@google/generative-ai";

interface FunctionCall {
  name: string;
  args?: {
    route?: string;
    productId?: string;
    fit?: string;
    size?: string;
    method?: string;
    action?: string;
    category?: string;
    isRewardsMember?: boolean;
    name?: string;
    field?: string;
    value?: string;
    phoneNumber?: string;
    code?: string;
    inseam?: string;
  };
}

const systemInstructionObject = {
  parts: [
    {
      text: `You are a very friendly shopping assistant.
      - when user says 'I like the baby boot jeans' you MUST Navigate to the "/baby-boot-jean" page and ONLY say 'Here you go!'
      - ONLY when you see the rewards prompt animation appear, then you must ask 'Are you a rewards member?'
      - when ever user says 'Yes' or 'No', you must 'CLICK' the button that corresponds to the response OR 'NAVIGATE' to the page that corresponds to the response.
      - when user say 'please add this item to my cart', you must 'CLICK' the button that corresponds to the response.
      - Example: when you ask "Would you like to check out some personalized items with 10%! off that I've picked just for you?" and if user says 'YES' or 'Oh! YaSure' or 'Ok' or 'Okie' or anything that means 'Yes', you must 'NAVIGATE' the personalized page.
      - Example: when user says 'I like the Gap Logo Tote Bag' or anything that means 'Gap Logo Tote Bag', you must 'NAVIGATE' the Gap Logo Tote page.
      - when user says 'Gap Logo Tote Bag' you MUST Click 'add to cart' button'

      
      
      `

    }
  ]
};

const toolObject: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "navigate",
        description: "Navigate to a specific product page or section",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            route: {
              type: SchemaType.STRING,
              description: "The route to navigate to",
              enum: [
                "/",
                "/all",
                "/women-casual-jeans",
                "/baby-boot-jean",
                "/gap-logo-tote",
                "/cart",
                "/order-payment-confirmation",
                "/profile",
                "/personalized"
              ]
            }
          },
          required: ["route"]
        }
      },
      {
        name: "addToCart",
        description: "Add current product to shopping cart",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            productId: {
              type: SchemaType.STRING,
              enum: ["gap-logo-tote", "baby-boot-jean"],
              description: "ID of the product to add"
            }
          },
          required: ["productId"]
        }
      },
      {
        name: "selectFit",
        description: "Select a fit option for the product",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            fit: {
              type: SchemaType.STRING,
              enum: ["Regular", "Tall", "Petite"],
              description: "The fit option to select"
            }
          },
          required: ["fit"]
        }
      },
      {
        name: "selectSize",
        description: "Select a size option for the product",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            size: {
              type: SchemaType.STRING,
              enum: ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
              description: "The size option to select"
            }
          },
          required: ["size"]
        }
      },
      {
        name: "setFullName",
        description: "Set the full name in the shipping address form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: {
              type: SchemaType.STRING,
              description: "The full name to set in the form"
            }
          },
          required: ["name"]
        }
      },
      {
        name: "setShippingField",
        description: "Set a field in the shipping address form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            field: {
              type: SchemaType.STRING,
              enum: ["fullName", "street", "apt", "city", "zipCode"],
              description: "The field to update in the form"
            },
            value: {
              type: SchemaType.STRING,
              description: "The value to set in the field"
            }
          },
          required: ["field", "value"]
        }
      },
      {
        name: "selectShippingMethod",
        description: "Select a shipping method option",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            method: {
              type: SchemaType.STRING,
              enum: [
                "No-Rush Shipping",
                "Basic Shipping",
                "Standard Shipping",
                "Express Shipping",
                "Priority Shipping"
              ],
              description: "The shipping method to select"
            }
          },
          required: ["method"]
        }
      },
      {
        name: "clickContinue",
        description: "Click the continue button in the shipping form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["click"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "setPhoneNumber",
        description: "Set the phone number in the quick pay form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            phoneNumber: {
              type: SchemaType.STRING,
              description: "The phone number to set in the form"
            }
          },
          required: ["phoneNumber"]
        }
      },
      {
        name: "clickSendCode",
        description: "Click the send code button in the quick pay form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["click"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "setVerificationCode",
        description: "Set the verification code in the form",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            code: {
              type: SchemaType.STRING,
              description: "The verification code to enter"
            }
          },
          required: ["code"]
        }
      },
      {
        name: "clickVerify",
        description: "Click the verify button",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["click"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "sendPaymentLink",
        description: "Click the send payment link button",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["click"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "completePayment",
        description: "Click the complete payment with wallet button",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["click"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "checkRewardsStatus",
        description: "Check if user is a rewards member",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            action: {
              type: SchemaType.STRING,
              enum: ["check"],
              description: "Action to perform"
            }
          },
          required: ["action"]
        }
      },
      {
        name: "showPersonalizedItems",
        description: "Show personalized recommendations",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            category: {
              type: SchemaType.STRING,
              enum: ["belts", "sweaters", "all"],
              description: "Category of items to show"
            }
          },
          required: ["category"]
        }
      },
      {
        name: "respondToRewardsPrompt",
        description: "Respond to rewards membership prompt",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            isRewardsMember: {
              type: SchemaType.BOOLEAN,
              description: "Whether the user is a rewards member"
            }
          },
          required: ["isRewardsMember"]
        }
      }
    ]
  }
];

const NavAssistantComponent = () => {
  const { client, setConfig, connected, connect } = useLiveAPIContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hasShownPostLoginMessage, setHasShownPostLoginMessage] = useState(false);

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      tools: toolObject,
      systemInstruction: systemInstructionObject,
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Aoede"
            }
          }
        }
      }
    });
  }, [setConfig]);

  // Add new effect to initiate conversation when connected
  useEffect(() => {
    if (connected && client) {
      client.send([
        {
          text: "Greet the user saying 'Hi! how can i help you today?'"
        }
      ]);
    }
  }, [connected, client]);

  useEffect(() => {
    let hasAskedRewards = false;

    const handleRewardsPrompt = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (connected && client && !isLoggingIn && !hasAskedRewards) {
        console.log('🎯 Rewards prompt event:', customEvent.type, customEvent.detail);
        
        if (customEvent.type === 'rewardsPromptFade') {
          console.log('📢 Asking about rewards membership');
          client.send([
            {
              text: "Are you a rewards member?"
            }
          ]);
          hasAskedRewards = true;
        }
      }
    };

    // Listen for both fade start and prompt show events
    document.addEventListener('rewardsPromptFade', handleRewardsPrompt);
    document.addEventListener('rewardsPromptShow', handleRewardsPrompt);

    return () => {
      document.removeEventListener('rewardsPromptFade', handleRewardsPrompt);
      document.removeEventListener('rewardsPromptShow', handleRewardsPrompt);
      hasAskedRewards = false;
    };
  }, [client, connected, isLoggingIn]);

  // Add effect to update current product based on route
  useEffect(() => {
    switch (location.pathname) {
      case '/gap-logo-tote':
        setCurrentProduct('gap-logo-tote');
        break;
      case '/baby-boot-jean':
        setCurrentProduct('baby-boot-jean');
        break;
      default:
        setCurrentProduct('');
    }
  }, [location.pathname]);

  // Update login completion effect
  useEffect(() => {
    if (!isLoggingIn) return;

    const checkLoginStatus = () => {
      const isBackOnPage = location.pathname === '/baby-boot-jean' || location.pathname === '/gap-logo-tote';
      const isLoggedIn = document.querySelector('.user-logged-in') !== null;

      if (isBackOnPage && isLoggedIn && !hasShownPostLoginMessage) {
        setIsLoggingIn(false);
        setHasShownPostLoginMessage(true);
      }
    };

    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, [isLoggingIn, location.pathname, client, hasShownPostLoginMessage]);

  useEffect(() => {
    const handleRewardsResponse = async (isRewardsMember: boolean) => {
      console.log('🎭 Handling rewards response:', isRewardsMember);
      console.log('Current product context:', currentProduct);
      
      if (!connected) {
        console.log('🔌 Not connected, connecting...');
        await connect();
      }

      if (isRewardsMember && !isLoggingIn) {
        console.log('👍 User is rewards member, setting login state');
        setIsLoggingIn(true);
        client.send([
          {
            text: "Great! I'll wait while you sign in to access your rewards benefits."
          }
        ]);
        
        const yesButton = document.querySelector('.rewards-prompt button:first-child') as HTMLButtonElement;
        if (yesButton) {
          yesButton.click();
        }
      } else if (!isRewardsMember) {
        client.send([
          {
            text: "No problem! Let's continue shopping. You can always join our rewards program later."
          }
        ]);
        
        const noButton = document.querySelector('.rewards-prompt button:last-child') as HTMLButtonElement;
        if (noButton) {
          noButton.click();
        }
      }
    };

    const onToolCall = (toolCall: { functionCalls: FunctionCall[] }) => {
      const fCalls = toolCall.functionCalls;
      if (fCalls?.length > 0) {
        fCalls.forEach(async (fCall: FunctionCall) => {
          if (fCall.name === "navigate") {
            const args = fCall.args;
            if (args && args.route === '/women-casual-jeans') {
              client.send([{ text: "JUST OUTPUT THE USER 'Here you go!'" }]);
              navigate('/women-casual-jeans');
            } else if (args && args.route === '/baby-boot-jean') {
              client.send([{ text: "JUST OUTPUT THE USER 'Here you go! are you a rewards member?'" }]);
              navigate('/baby-boot-jean');
            } else if (args && args.route === '/gap-logo-tote') {
              client.send([{ text: " JUST OUTPUT THE USER 'Here you go! Let me show you our Gap Logo Tote.'" }]);
              navigate('/gap-logo-tote');
            } else if (args && args.route === '/cart') {
              client.send([{ text: "JUST OUTPUT THE USER 'Here's your shopping cart.'" }]);
              navigate('/cart');
            } else if (args && args.route === '/personalized') {
              client.send([{ text: "JUST OUTPUT THE USER 'Here are some personalized recommendations for you!'" }]);
              navigate('/personalized');
            } else if (args && args.route) {
              client.send([{ text: "Here you go!" }]);
              navigate(args.route);
            }
          } else if (fCall.name === "addToCart") {
            const args = fCall.args as { productId?: string };
            const productId = args?.productId;
            
            if (productId === 'gap-logo-tote') {
              console.log('🛒 Adding Gap Logo Tote to cart');
              const addToCartButton = document.querySelector('.add-to-bag') as HTMLButtonElement;
              
              if (addToCartButton) {
                console.log('🔘 Found add to cart button, clicking...');
                addToCartButton.click();
                
                // Confirm action to user
                client.send([
                  {
                    text: "I've added the Gap Logo Tote to your cart!"
                  }
                ]);
              } else {
                console.log('⚠️ Add to cart button not found');
                client.send([
                  {
                    text: "I couldn't find the add to cart button. Please try again."
                  }
                ]);
              }
            } else if (productId && typeof productId === 'string') {
              console.log('🛒 Adding to cart:', productId);
              
              // First check if we need to select a size
              if (!document.querySelector('.size-option.selected')) {
                client.send([
                  {
                    text: "Please select a size first before I can add this to your cart."
                  }
                ]);
                return;
              }

              // Find and click the add to cart button
              const addToCartButton = document.querySelector('.add-to-bag') as HTMLButtonElement;
              if (addToCartButton && !addToCartButton.disabled) {
                console.log('🔘 Found add to cart button, clicking...');
                addToCartButton.click();
                
                // The itemAddedToCart event will handle the response message
                // No need to send a message here as it's handled by the event listener
              } else {
                console.log('⚠️ Add to cart button not found or disabled');
                client.send([
                  {
                    text: "I couldn't add this to your cart. Please make sure you've selected all required options."
                  }
                ]);
              }
            }
          } else if (fCall.name === "selectFit") {
            const args = fCall.args as { fit?: string };
            const fit = args?.fit;
            if (fit && typeof fit === 'string') {
              const fitButtons = document.querySelectorAll('.fit-option');
              const validFits = ['Regular', 'Tall', 'Petite'];
              fitButtons.forEach((button: Element) => {
                if (button instanceof HTMLButtonElement && 
                    validFits.includes(fit) && 
                    button.textContent === fit) {
                  button.click();
                }
              });
            }
          } else if (fCall.name === "selectSize") {
            const args = fCall.args as { size?: string };
            const size = args?.size;
            if (size && typeof size === 'string') {
              const sizeButtons = document.querySelectorAll('.size-option');
              const validSizes = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'];
              sizeButtons.forEach((button: Element) => {
                if (button instanceof HTMLButtonElement && 
                    validSizes.includes(size) && 
                    button.textContent?.trim() === size && 
                    !button.disabled) {
                  button.click();
                }
              });
            }
          } else if (fCall.name === "selectInseam") {
            const args = fCall.args as { inseam?: string };
            const inseam = args?.inseam;
            if (inseam && typeof inseam === 'string') {
              const inseamButtons = document.querySelectorAll('.size-option');
              const validInseams = ['Short', 'Regular', 'Long'];
              inseamButtons.forEach((button: Element) => {
                if (button instanceof HTMLButtonElement && 
                    validInseams.includes(inseam) && 
                    button.textContent === inseam) {
                  button.click();
                }
              });
            }
          } else if (fCall.name === "setFullName") {
            const args = fCall.args;
            if (args && args.name) {
              const nameInput = document.querySelector('input[placeholder="Full Name"]') as HTMLInputElement;
              if (nameInput) {
                nameInput.value = args.name;
                // Trigger change event to update React state
                const event = new Event('change', { bubbles: true });
                nameInput.dispatchEvent(event);
              }
            }
          } else if (fCall.name === "setShippingField") {
            const args = fCall.args;
            if (args && args.field && args.value) {
              let selector = '';
              switch (args.field) {
                case 'fullName':
                  selector = 'input[placeholder="Full Name"]';
                  break;
                case 'street':
                  selector = 'input[placeholder="Street Address"]';
                  break;
                case 'apt':
                  selector = 'input[placeholder="Apt #"]';
                  break;
                case 'city':
                  selector = 'input[placeholder="Town/City"]';
                  break;
                case 'zipCode':
                  selector = 'input[placeholder="Zip Code"]';
                  break;
              }

              const input = document.querySelector(selector) as HTMLInputElement;
              if (input) {
                input.value = args.value;
                // Trigger change event to update React state
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
              }
            }
          } else if (fCall.name === "selectShippingMethod") {
            const args = fCall.args;
            if (args && args.method) {
              const shippingOptions = document.querySelectorAll('.shipping-option');
              shippingOptions.forEach((option: Element) => {
                const methodElement = option.querySelector('.method');
                if (methodElement && methodElement.textContent === args.method) {
                  (option as HTMLElement).click();
                }
              });
            }
          } else if (fCall.name === "clickContinue") {
            const continueButton = document.querySelector('.continue-btn') as HTMLButtonElement;
            if (continueButton) {
              continueButton.click();
            }
          } else if (fCall.name === "setPhoneNumber") {
            const args = fCall.args;
            if (args && args.phoneNumber) {
              // Find the React component instance
              const phoneInput = document.querySelector('#phone') as HTMLInputElement;
              if (phoneInput) {
                // Get the React fiber instance
                const reactInstance = phoneInput[Object.keys(phoneInput).find(key => 
                  key.startsWith('__reactProps$')
                ) as keyof HTMLInputElement];
                
                if (reactInstance) {
                  // Call the onChange handler directly
                  const syntheticEvent = {
                    target: {
                      value: args.phoneNumber
                    },
                    preventDefault: () => {}
                  };
                  // @ts-ignore
                  reactInstance.onChange(syntheticEvent);
                }

                // Also update the DOM value for good measure
                phoneInput.value = args.phoneNumber;

                // Wait a brief moment to ensure state is updated
                setTimeout(() => {
                  // Click the send code button
                  const sendCodeButton = document.querySelector('.phone-input-row button[type="submit"]') as HTMLButtonElement;
                  if (sendCodeButton) {
                    sendCodeButton.click();
                  }
                }, 100);
              }
            }
          } else if (fCall.name === "clickSendCode") {
            // Wait a brief moment to ensure phone number state is updated
            setTimeout(() => {
              const sendCodeButton = document.querySelector('.phone-input-row button') as HTMLButtonElement;
              if (sendCodeButton) {
                sendCodeButton.click();
              }
            }, 100);
          } else if (fCall.name === "setVerificationCode") {
            const args = fCall.args;
            if (args && args.code) {
              // Find the verification code input
              const codeInput = document.querySelector('#code') as HTMLInputElement;
              if (codeInput) {
                // Get the React fiber instance
                const reactInstance = codeInput[Object.keys(codeInput).find(key => 
                  key.startsWith('__reactProps$')
                ) as keyof HTMLInputElement];
                
                if (reactInstance) {
                  // Call the onChange handler directly
                  const syntheticEvent = {
                    target: {
                      value: args.code
                    },
                    preventDefault: () => {}
                  };
                  // @ts-ignore
                  reactInstance.onChange(syntheticEvent);
                }

                // Also update the DOM value
                codeInput.value = args.code;

                // Wait a brief moment to ensure state is updated
                setTimeout(() => {
                  // Click the verify button
                  const verifyButton = document.querySelector('.verification-code-row button[type="submit"]') as HTMLButtonElement;
                  if (verifyButton) {
                    verifyButton.click();
                  }
                }, 100);
              }
            }
          } else if (fCall.name === "clickVerify") {
            // Wait a brief moment to ensure verification code state is updated
            setTimeout(() => {
              const verifyButton = document.querySelector('.verification-code-row button') as HTMLButtonElement;
              if (verifyButton) {
                verifyButton.click();
              }
            }, 100);
          } else if (fCall.name === "sendPaymentLink") {
            const sendLinkButton = document.querySelector('.send-link-btn') as HTMLButtonElement;
            if (sendLinkButton) {
              sendLinkButton.click();
            }
          } else if (fCall.name === "completePayment") {
            const completePaymentButton = document.querySelector('.wallet-pay-btn') as HTMLButtonElement;
            if (completePaymentButton) {
              completePaymentButton.click();
            }
          } else if (fCall.name === "checkRewardsStatus") {
            const rewardsButton = document.querySelector('.rewards-unlock-btn') as HTMLButtonElement;
            if (rewardsButton) {
              client.send([
                {
                  text: "Great! I'll wait while you sign in to access your rewards benefits."
                }
              ]);
              rewardsButton.click();
            }
          } else if (fCall.name === "showPersonalizedItems") {
            const args = fCall.args;
            if (args && args.category) {
              navigate('/personalized');
              // Additional logic to filter by category
            }
          } else if (fCall.name === "respondToRewardsPrompt") {
            const args = fCall.args;
            if (args && typeof args.isRewardsMember === 'boolean') {
              handleRewardsResponse(args.isRewardsMember);
            }
          }
        });
      }
    };

    if (client) {
      client.on("toolcall", onToolCall);
      return () => {
        client.off("toolcall", onToolCall);
      };
    }
  }, [client, navigate, currentProduct, connected, connect, isLoggingIn]);

  useEffect(() => {
    const handleItemAddedToCart = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('🎯 NavAssistant received itemAddedToCart event:', customEvent.detail);
      
      if (!connected || !client || isLoggingIn) {
        console.log('❌ Client not ready or user logging in');
        return;
      }

      const isAuthenticated = customEvent.detail?.isAuthenticated;
      console.log('👤 User authentication status:', isAuthenticated);
      
      if (isAuthenticated) {
        client.send([
          {
            text: "Would you like to check out some personalized items with 10% off that I've picked just for you?"
          }
        ]);
      } else {
        client.send([
          {
            text: "Great! I've added that to your cart. Would you like to continue shopping?"
          }
        ]);
      }
    };

    // Add the event listener
    console.log('🎧 Adding itemAddedToCart event listener');
    document.addEventListener('itemAddedToCart', handleItemAddedToCart);

    return () => {
      console.log('🗑️ Removing itemAddedToCart event listener');
      document.removeEventListener('itemAddedToCart', handleItemAddedToCart);
    };
  }, [client, connected, isLoggingIn]);

  return null;
};

export const NavAssistant = memo(NavAssistantComponent); 