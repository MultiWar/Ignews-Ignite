import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import { Async } from "."

describe('Async component', () => {
    it('renders correctly', async () => {
        render(<Async />)

        expect(screen.getByText('Apenas testando, amigo')).toBeInTheDocument()

        // button won't show up with .getByText() because it only appears after 1 second,
        // so there are functions to help us. It can be tested with:
        // expect(await screen.findByText('Button')).toBeInTheDocument()

        // or:
        // await waitFor(() => {
        //     return expect(screen.getByText('Button')).toBeInTheDocument()
        // })

        //if you want to wait for an element to be removed, however, this is how it should be done:

        // await waitForElementToBeRemoved(screen.queryByText("I'm invisible!"))

        // or:

        // await waitFor(() => {
        //     return expect(screen.queryByText("I'm invisible!")).not.toBeInTheDocument()
        // })

        // In summary, screen has 3 types of methods, that start with:
        // - get - not async and will return an error if not found;
        // - find - async will wait for the element to appear, will return an error if not found;
        // - query - async will wait for the element to appear/disappear and will not return an error if not found
    })
})