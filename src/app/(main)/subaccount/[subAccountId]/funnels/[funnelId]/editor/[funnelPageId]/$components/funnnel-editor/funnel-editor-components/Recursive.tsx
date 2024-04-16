import { EditorElement } from "@/app/providers/web-editor/editorProvider";
import Container from "./Container";
import TextComponent from "./text";
import VideoComponent from "./VideoComponent";
import LinkComponent from "./LinkComponent";
import TwoColumnComponent from "./TwoColumnComponent";
import ContactFormComponent from "./ContactFormComponent";
import CheckoutComponent from "./Checkout";

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case "text":
      return <TextComponent element={element} />;
    case "__body":
      return <Container element={element} />;
    case "container":
      return <Container element={element} />;
    case "video":
      return <VideoComponent element={element} />;
    case "link":
      return <LinkComponent element={element} />;
    case '2Col':
      return <TwoColumnComponent element={element}/>
    case 'contactForm':
      return <ContactFormComponent element={element}/>
    case 'paymentForm':
      return <CheckoutComponent  element={element}/>
    default:
      return null;
  }
};

export default Recursive;
