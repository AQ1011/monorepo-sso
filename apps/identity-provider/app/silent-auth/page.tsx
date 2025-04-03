import { cookies } from "next/headers";
import { verify, sign } from "jsonwebtoken";

export default async function Page({
	searchParams: { accessToken },
}: {
	searchParams: {
		accessToken: string;
	};
}) {
	if (accessToken) {
		try {
			return (
				<div>
					<script
						dangerouslySetInnerHTML={{
							__html: `
                    // Extract the token or error from the URL
                    const token = '${accessToken}';
    
                    // Construct a result object
                    const result = { token };
    
                    // Send the result to the parent window
                    window.parent.postMessage(result, '*');  
                `,
						}}
					></script>
				</div>
			);
		} catch (err) {
			console.log(err);
		}
	}
	return (
		<div>
			<script
				dangerouslySetInnerHTML={{
					__html: `
                // Extract the token or error from the URL
                const token = '${accessToken}';

                // Construct a result object
                const result = { token };

                // Send the result to the parent window
                window.parent.postMessage(result, '*');  
            `,
				}}
			></script>
		</div>
	);
}
