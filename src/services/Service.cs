namespace GlamourIntence.Services
{
    public class Service
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }

        public Service(string name, string category, decimal price)
        {
            Name = name;
            Category = category;
            Price = price;
        }
    }
}